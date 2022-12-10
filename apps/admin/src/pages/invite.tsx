import {
  Button,
  Container,
  Flex,
  Paper,
  SegmentedControl,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';

export const InvitePage = () => {
  const form = useForm({
    initialValues: {
      email: '',
      expiresAt: '7d',
      ia: AccountType.Teacher,
    },
    validate: {
      email: (_value) => null,
    },
  });

  return (
    <Container size={'xs'} my={40} px={0}>
      <Title align="center">Send invite</Title>
      <Paper withBorder shadow="md" p={25} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => void console.log(values))}>
          <TextInput label="Email" required {...form.getInputProps('email')} />
          <Space h="xs" />
          <Select
            label="Validity"
            data={[{ label: '7 days', value: '7d' }]}
            {...form.getInputProps('expiresAt')}
          />
          <Space h="xs" />
          <Flex align={'center'} gap={'lg'}>
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
          <Button fullWidth mt="xl" type="submit">
            Create
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
