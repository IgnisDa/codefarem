import { z } from 'zod';
import {
  Button,
  Container,
  Flex,
  Paper,
  SegmentedControl,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  ia: z.nativeEnum(AccountType),
});

const times = [
  ['1 hour', '1h'],
  ['1 day', '1d'],
  ['1 week', '1w'],
  ['1 month', '1m'],
];

export const InvitePage = () => {
  const form = useForm({
    initialValues: {
      email: '',
      expiresAt: times[2][1],
      ia: AccountType.Teacher,
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={'xs'} my={40} px={0}>
      <Title align="center">Send invite</Title>
      <Paper withBorder shadow="md" p={25} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => void console.log(values))}>
          <TextInput label="Email" required {...form.getInputProps('email')} />
          <Select
            label="Valid for"
            data={times.map(([label, value]) => ({ label, value }))}
            mt="sm"
            {...form.getInputProps('expiresAt')}
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
              {...form.getInputProps('ia')}
            />
          </Flex>
          <Button fullWidth mt="sm" type="submit">
            Create
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
