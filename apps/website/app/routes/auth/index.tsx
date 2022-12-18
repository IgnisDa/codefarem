import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { Hanko, NotFoundError } from '@teamhanko/hanko-frontend-sdk';
import { useFetcher } from '@remix-run/react';
import { SUCCESSFUL_REDIRECT_PATH } from '~/lib/constants';
import { USER_WITH_EMAIL } from ':generated/graphql/orchestrator/queries';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import { REGISTER_USER } from ':generated/graphql/orchestrator/mutations';
import authStyles from '../../styles/auth/index.css';
import {
  Button,
  Center,
  Paper,
  Stack,
  Stepper,
  TextInput,
} from '@mantine/core';
import { IconMailOpened, IconShieldCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: authStyles }];
};

const authSchema = z.object({
  email: z.string().email(),
  hankoId: z.string(),
  inviteToken: z.string().optional(),
});

export const action = async ({ request }: ActionArgs) => {
  const { hankoId, email, inviteToken } = await zx.parseForm(
    request.clone(),
    authSchema
  );
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const username = new Date().toISOString();
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, hankoId, inviteToken: inviteToken || null },
    });
  }
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo');
  if (redirectTo) return redirect(redirectTo);
  return redirect(SUCCESSFUL_REDIRECT_PATH);
};

const emailSchema = z.object({
  email: z.string().email(),
  inviteToken: z.string().optional(),
});
const passcodeSchema = z.object({
  passcode: z.string().length(6),
});

export default () => {
  const [active, setActive] = useState(0);
  const [hankoUserId, setHankoUserId] = useState('');
  const [hankoSdk, setHankoSdk] = useState<Hanko>();
  const [inviteToken, setInviteToken] = useState('');
  const fetcher = useFetcher();
  const emailForm = useForm({
    validate: zodResolver(emailSchema),
    initialValues: { email: '', inviteToken: '' },
  });
  const passcodeForm = useForm({
    validate: zodResolver(passcodeSchema),
    initialValues: { passcode: '' },
  });

  useEffect(() => {
    setHankoSdk(new Hanko(window.ENV.HANKO_URL));
  }, []);

  return (
    <Center h={'100%'} mx={'md'}>
      {hankoSdk ? (
        <Paper withBorder p="md">
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              label="Credentials"
              description="Enter your email"
              icon={<IconMailOpened size={18} />}
            >
              <form
                onSubmit={emailForm.onSubmit(async (values) => {
                  if (values.inviteToken) setInviteToken(values.inviteToken);
                  let userId = null;
                  try {
                    const user = await hankoSdk.user.getInfo(values.email);
                    userId = user.id;
                  } catch (e) {
                    if (e instanceof NotFoundError) {
                      console.log('User not found, creating new user');
                      const user = await hankoSdk.user.create(values.email);
                      userId = user.id;
                    }
                  } finally {
                    if (userId) setHankoUserId(userId);
                    if (!userId) {
                      showNotification({
                        title: 'Authorization Error',
                        message: 'There was an error authorizing you',
                        color: 'red',
                      });
                    } else {
                      await hankoSdk.passcode.initialize(userId);
                      setActive(1);
                    }
                  }
                })}
              >
                <Stack>
                  <TextInput
                    placeholder="ana@email.com"
                    description="An email will be sent for verification"
                    type={'email'}
                    {...emailForm.getInputProps('email')}
                  />
                  <TextInput
                    description="Enter invite token if you have one"
                    {...emailForm.getInputProps('inviteToken')}
                  />
                  <Button type="submit">Submit</Button>
                </Stack>
              </form>
            </Stepper.Step>
            <Stepper.Step
              label="Verification"
              description="Enter passcode"
              icon={<IconShieldCheck size={18} />}
              allowStepSelect={active >= 1}
            >
              <form
                onSubmit={passcodeForm.onSubmit(async (values) => {
                  try {
                    await hankoSdk.passcode.finalize(
                      hankoUserId,
                      values.passcode
                    );
                    const data = authSchema.parse({
                      hankoId: hankoUserId,
                      email: emailForm.values.email,
                      inviteToken: inviteToken,
                    });
                    fetcher.submit(data, { method: 'post' });
                  } catch (e) {
                    console.log(JSON.stringify(e));
                  }
                })}
              >
                <Stack>
                  <TextInput
                    description="Enter the passcode sent to your email"
                    {...passcodeForm.getInputProps('passcode')}
                  />
                  <Button type="submit">Submit</Button>
                </Stack>
              </form>
            </Stepper.Step>
          </Stepper>
        </Paper>
      ) : (
        <>Loading...</>
      )}
    </Center>
  );
};
