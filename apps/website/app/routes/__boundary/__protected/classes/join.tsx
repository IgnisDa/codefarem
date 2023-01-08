import { Button, Container, Paper, TextInput, Title } from '@mantine/core';
import { Form } from '@remix-run/react';

export default () => {
  return (
    <Container size={'xs'}>
      <Title align="center">Join a class</Title>
      <Paper withBorder shadow="md" p={25} mt={30} radius="md">
        <Form method='post'>
          <TextInput label="Code" placeholder='Enter the class code' required />
          <Button fullWidth mt="sm" type="submit">
            Join
          </Button>
        </Form>
      </Paper>
    </Container>
  );
};
