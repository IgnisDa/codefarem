import { useFragment } from ':generated/graphql/orchestrator';
import { AccountType } from ':generated/graphql/orchestrator/graphql';
import { CREATE_CLASS } from ':graphql/orchestrator/mutations';
import {
  SEARCH_USER_DETAILS_FRAGMENT,
  SEARCH_USERS,
} from ':graphql/orchestrator/queries';
import {
  Button,
  Container,
  Divider,
  Flex,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { forwardRef } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import { forbiddenError } from '~/lib/utils';
import type { SearchUserDetailsFragment } from ':generated/graphql/orchestrator/graphql';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type { FragmentType } from ':generated/graphql/orchestrator';
import type { ComponentPropsWithoutRef } from 'react';

const convertFromFragmentList = (
  list: FragmentType<typeof SEARCH_USER_DETAILS_FRAGMENT>[],
  _accountType: AccountType
) => {
  return list.map((s) => {
    const frag = useFragment(SEARCH_USER_DETAILS_FRAGMENT, s);
    return {
      value: frag.id,
      details: frag.profile,
      label: frag.profile.username,
    };
  });
};

interface ItemProps extends ComponentPropsWithoutRef<'div'> {
  details: SearchUserDetailsFragment['profile'];
}

const MultiSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ details, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text>{details.username}</Text>
      <Text color={'dimmed'}>{details.email}</Text>
    </div>
  )
);

export const loader = async ({ request }: LoaderArgs) => {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();
  const { searchUsers } = await gqlClient.request(SEARCH_USERS, { input: {} });

  const students = convertFromFragmentList(
    searchUsers.students,
    AccountType.Student
  );
  const teachers = convertFromFragmentList(
    searchUsers.teachers,
    AccountType.Teacher
  );
  return json({ students, teachers });
};

export const action = async ({ request }: ActionArgs) => {
  const { name, studentsData, teachersData } = await zx.parseForm(
    request.clone(),
    {
      name: z.string(),
      // the `MultiSelect` component returns a comma separated string of values
      studentsData: z.string(),
      teachersData: z.string(),
    }
  );
  const teacherIds = teachersData.split(',').filter(Boolean);
  const studentIds = studentsData.split(',').filter(Boolean);

  const { createClass } = await gqlClient.request(
    CREATE_CLASS,
    { input: { name, teacherIds: teacherIds } },
    authenticatedRequest(request)
  );
  if (createClass.__typename === 'ApiError')
    throw badRequest({ message: createClass.error });
  throw redirect(route('/classes/:id', { id: createClass.id }));
};

export default () => {
  const { students, teachers } = useLoaderData<typeof loader>();

  return (
    <Container size={'sm'}>
      <Stack>
        <Title>Create Class</Title>
        <Form method="post">
          <Stack>
            <TextInput label="Name" type={'text'} required name="name" />
            <MultiSelect
              name="teachersData"
              data={teachers}
              label={'Teachers'}
              itemComponent={MultiSelectItem}
              searchable
            />
            <MultiSelect
              name="studentsData"
              data={students}
              label={'Students'}
              itemComponent={MultiSelectItem}
              searchable
            />
            <Divider variant={'dashed'} />
            <Flex
              justify={{ base: 'center', md: 'end' }}
              gap={'md'}
              wrap={'wrap'}
            >
              <Button variant={'light'} color="green" type={'submit'}>
                Create class
              </Button>
            </Flex>
          </Stack>
        </Form>
      </Stack>
    </Container>
  );
};
