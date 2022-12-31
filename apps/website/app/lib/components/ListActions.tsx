import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Flex,
  Menu,
  Modal,
  Stack
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Form } from '@remix-run/react';
import { IconCopy, IconDots, IconEdit, IconTrash } from '@tabler/icons';
import { withQuery } from 'ufo';

import { PageAction } from '../utils';

interface ListActionsProps {
  hasDuplicateAction?: boolean;
  page: 'questions' | 'classes';
  query: { [key: string]: string };
  modalText: string;
}

export const ListActions = ({
  hasDuplicateAction,
  page,
  query,
  modalText
}: ListActionsProps) => {
  const [isModalOpen, handler] = useDisclosure(false);

  const actions = [
    {
      icon: <IconEdit size={14} />,
      label: PageAction.Update,
      href: withQuery(`/${page}/Update-action`, query)
    }
  ];

  if (hasDuplicateAction)
    actions.push({
      icon: <IconCopy size={14} />,
      label: PageAction.Duplicate,
      href: withQuery(`/${page}/Duplicate-action`, query)
    });

  return (
    <>
      <Menu width={200}>
        <Menu.Target>
          <ActionIcon variant={'default'}>
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Actions</Menu.Label>
          {actions.map((action, idx) => (
            <Menu.Item icon={action.icon} key={idx}>
              <Anchor href={action.href} variant={'text'} display={'block'}>
                {action.label}
              </Anchor>
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={handler.toggle}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        size="sm"
        centered
        title="Delete question"
        opened={isModalOpen}
        onClose={handler.close}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Stack>
          <Box>{modalText}</Box>
          <Flex justify={'space-between'}>
            <Button variant="outline" onClick={handler.close}>
              Cancel
            </Button>
            <Form method={'post'} reloadDocument>
              <input
                type="hidden"
                name={Object.keys(query)[0]}
                value={Object.values(query)[0]}
              />
              <Button
                color="red"
                type={'submit'}
                name={'action'}
                value={PageAction.Delete}
              >
                {PageAction.Delete}
              </Button>
            </Form>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};
