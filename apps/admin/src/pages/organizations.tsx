import { Button, Container, Paper, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

export const OrganizationsPage = () => {
  const form = useForm({
    initialValues: { name: '' },
    validate: {
      // TODO: Validate name from backend API
      name: (_value) => null,
    },
  });

  return (
    <Container size={'xs'} my={40} px={0}>
      <Title align="center">Create Organization</Title>
      <Paper withBorder shadow="md" p={25} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => void console.log(values))}>
          <TextInput label="Name" required {...form.getInputProps('name')} />
          <Button fullWidth mt="xl" type="submit">
            Create
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
