import { z } from 'zod';
import {
  Accordion,
  Alert,
  Button,
  Center,
  Container,
  CopyButton,
  Flex,
  Grid,
  Paper,
  SegmentedControl,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AccountType,
  CreateInviteLinkInput,
} from ':generated/graphql/admin/generated/graphql';
import { CREATE_INVITE_LINK } from ':generated/graphql/admin/mutations';
import { ALL_INVITE_LINKS } from ':generated/graphql/admin/queries';
import { client } from '../services/graphql';

const schema = z.object({
  accountType: z.nativeEnum(AccountType),
  email: z.string().email({ message: 'Invalid email' }),
  validFor: z.string(),
});

const times = [
  ['1 hour', '1h'],
  ['1 day', '1d'],
  ['1 week', '1w'],
  ['1 month', '1M'],
];

export const InvitePage = () => {
  const { data, refetch } = useQuery(['allInviteLinks'], async () => {
    const { allInviteLinks } = await client.request(ALL_INVITE_LINKS);
    return allInviteLinks;
  });

  const form = useForm({
    initialValues: {
      accountType: AccountType.Teacher,
      email: '',
      validFor: times[2][1],
    },
    validate: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (input: CreateInviteLinkInput) => {
      const { createInviteLink } = await client.request(CREATE_INVITE_LINK, {
        input,
      });
      return createInviteLink;
    },
    onSuccess: async () => {
      await refetch();
      form.reset();
    },
  });

  return (
    <Container px={0} size={'lg'}>
      <Grid>
        <Grid.Col md={6}>
          <Title align="center">All Invite Links</Title>
          <Space mt={'md'} />
          {data?.length === 0 ? (
            <Alert color={'red'}>You do not have active invite links</Alert>
          ) : (
            <Accordion>
              {data?.map((invite) => (
                <Accordion.Item value={invite.id} key={invite.id}>
                  <Accordion.Control>{invite.role}</Accordion.Control>
                  <Accordion.Panel>
                    {invite.isActive ? (
                      <>
                        <Text>
                          Invite for{' '}
                          <Text span underline>
                            {invite.email}
                          </Text>{' '}
                          will expire on{' '}
                          <Text span underline>
                            {new Date(invite.expiresAt).toDateString()}
                          </Text>
                        </Text>
                        <Center mt={'sm'}>
                          <CopyButton value={invite.token}>
                            {({ copied, copy }) => (
                              <Button
                                color={copied ? 'teal' : 'blue'}
                                onClick={copy}
                              >
                                {copied ? 'Copied' : 'Copy'} token
                              </Button>
                            )}
                          </CopyButton>
                        </Center>
                      </>
                    ) : (
                      <Text>This link has already been used</Text>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Grid.Col>
        <Grid.Col md={6}>
          <Title align="center">Send invite</Title>
          <Paper withBorder shadow="md" p={25} mt={30} radius="md">
            <form
              onSubmit={form.onSubmit((values) => {
                mutation.mutate(values);
              })}
            >
              <TextInput
                label="Email"
                type={'email'}
                required
                {...form.getInputProps('email')}
              />
              <Select
                label="Valid for"
                data={times.map(([label, value]) => ({ label, value }))}
                mt="sm"
                {...form.getInputProps('validFor')}
              />
              <Flex align={'center'} mt="sm" justify={'space-between'}>
                <Text fz={'sm'} span>
                  Invite As
                </Text>
                <SegmentedControl
                  data={[
                    { label: 'Teacher', value: AccountType.Teacher },
                    { label: 'Student', value: AccountType.Student },
                  ]}
                  {...form.getInputProps('accountType')}
                />
              </Flex>
              <Button fullWidth mt="sm" type="submit">
                Create
              </Button>
              {mutation.isSuccess && (
                <Alert mt={'lg'} color={'green'}>
                  Invite Link created!
                </Alert>
              )}
            </form>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
