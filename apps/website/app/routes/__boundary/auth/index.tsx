import { REGISTER_USER } from ':graphql/orchestrator/mutations';
import { USER_WITH_EMAIL } from ':graphql/orchestrator/queries';
import {
  Button,
  Center,
  createStyles,
  Paper,
  Stack,
  Stepper,
  TextInput,
  Title
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { PinInput } from '@mantine/labs';
import { showNotification } from '@mantine/notifications';
import { json, redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { IconMailOpened, IconShieldCheck } from '@tabler/icons';
import {
  Hanko,
  InvalidPasscodeError,
  NotFoundError
} from '@teamhanko/hanko-frontend-sdk';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zx } from 'zodix';
import { SUCCESSFUL_REDIRECT_PATH } from '~/lib/constants';
import { gqlClient } from '~/lib/services/graphql.server';
import { generateUsernameFromEmail, metaFunction } from '~/lib/utils';
import type { ActionArgs } from '@remix-run/node';

export const meta = metaFunction;

export const loader = () => {
  return json({ meta: { title: 'Authenticate' } });
};

const authSchema = z.object({
  email: z.string().email(),
  hankoId: z.string(),
  inviteToken: z.string().optional()
});

export const action = async ({ request }: ActionArgs) => {
  const { hankoId, email, inviteToken } = await zx.parseForm(
    request.clone(),
    authSchema
  );
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email }
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const username = generateUsernameFromEmail(email);
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, hankoId, inviteToken: inviteToken || null }
    });
  }
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo');
  if (redirectTo) return redirect(redirectTo);
  return redirect(SUCCESSFUL_REDIRECT_PATH);
};

const emailSchema = z.object({
  email: z.string().email(),
  inviteToken: z.string().optional()
});
const passcodeSchema = z.object({
  passcode: z.string().length(6)
});

const useStyles = createStyles((_theme) => ({
  pinInput: {
    'div + div': {
      ['@media (min-width: 400px)']: { marginLeft: 7 }
    }
  }
}));

export default () => {
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [hankoUserId, setHankoUserId] = useState('');
  const [hankoSdk, setHankoSdk] = useState<Hanko>();
  const [inviteToken, setInviteToken] = useState('');
  const fetcher = useFetcher();
  const emailForm = useForm({
    validate: zodResolver(emailSchema),
    initialValues: { email: '', inviteToken: '' }
  });
  const passcodeForm = useForm({
    validate: zodResolver(passcodeSchema),
    initialValues: { passcode: '' }
  });

  useEffect(() => {
    setHankoSdk(new Hanko(window.ENV.HANKO_URL));
  }, []);

  return (
    <Center mx={'md'} h={800}>
      {hankoSdk ? (
        <Paper withBorder p="md">
          <Stack>
            <Title align='center'>Authenticate</Title>
            <Stepper active={active} onStepClick={setActive}>
              <Stepper.Step
                label="Credentials"
                description="Enter your email"
                icon={<IconMailOpened size={18} />}
              >
                <form
                  onSubmit={emailForm.onSubmit(async (values) => {
                    setIsLoading(true);
                    if (values.inviteToken) setInviteToken(values.inviteToken);
                    let userId = null;
                    try {
                      const user = await hankoSdk.user.getInfo(values.email);
                      userId = user.id;
                    } catch (e) {
                      if (e instanceof NotFoundError) {
                        const user = await hankoSdk.user.create(values.email);
                        showNotification({
                          title: 'System Action',
                          message: 'Created new user',
                          color: 'blue'
                        });
                        userId = user.id;
                      }
                    } finally {
                      if (userId) setHankoUserId(userId);
                      if (!userId) {
                        showNotification({
                          title: 'Authorization Error',
                          message: 'There was an error authorizing you',
                          color: 'red'
                        });
                      } else {
                        await hankoSdk.passcode.initialize(userId);
                        setActive(1);
                      }
                    }
                    setIsLoading(false);
                  })}
                >
                  <Stack>
                    <TextInput
                      id="email"
                      placeholder="ana@email.com"
                      description="An email will be sent for verification"
                      type={'email'}
                      {...emailForm.getInputProps('email')}
                    />
                    <TextInput
                      description="Enter invite token if you have one"
                      {...emailForm.getInputProps('inviteToken')}
                    />
                    <Button type="submit" loading={isLoading}>
                      Submit
                    </Button>
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
                    setIsLoading(true);
                    try {
                      await hankoSdk.passcode.finalize(
                        hankoUserId,
                        values.passcode
                      );
                      const data = authSchema.parse({
                        hankoId: hankoUserId,
                        email: emailForm.values.email,
                        inviteToken: inviteToken
                      });
                      fetcher.submit(data, { method: 'post' });
                    } catch (e) {
                      if (e instanceof InvalidPasscodeError)
                        showNotification({
                          title: 'Authorization Error',
                          message: 'Invalid passcode',
                          color: 'red'
                        });
                    }
                    setIsLoading(false);
                  })}
                >
                  <Stack>
                    <Center>
                      <PinInput
                        id="passcode"
                        length={6}
                        autoFocus
                        required
                        size={'lg'}
                        className={classes.pinInput}
                        {...passcodeForm.getInputProps('passcode')}
                      />
                    </Center>
                    <Button type="submit" loading={isLoading}>
                      Submit
                    </Button>
                  </Stack>
                </form>
              </Stepper.Step>
            </Stepper>
          </Stack>
        </Paper>
      ) : (
        <>Loading...</>
      )}
    </Center>
  );
};
