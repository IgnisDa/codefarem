import { useDisclosure } from '@mantine/hooks';
import { lazy, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils';
import type { Dispatch, ComponentType, LazyExoticComponent } from 'react';
import type { Folder } from '../folders';
import type { FolderTreeProps } from 'react-folder-tree';
import {
  IconFileCode2,
  IconFolder,
  IconPencil,
  IconTrash,
  IconX,
  IconFilePlus,
  IconFolderPlus,
  IconCheck,
} from '@tabler/icons';

// TODO: Use react-flow
// https://github.com/wbkd/react-flow-example-apps/blob/main/reactflow-remix/app/components/Flow/index.tsx

const ReactFolderTree: LazyExoticComponent<ComponentType<FolderTreeProps>> =
  lazy(async () => {
    const component = await import('react-folder-tree');
    return component.default as any;
  });

interface FoldersAndQuestionsProps {
  defaultFolder: Folder[];
  setFolders: Dispatch<Folder[]>;
}

export const FoldersAndQuestions = ({
  defaultFolder,
  setFolders,
}: FoldersAndQuestionsProps) => {
  const [folders, setNewFolders] = useState(defaultFolder);
  const [isOpen, handler] = useDisclosure(false);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    setFolders(folders);
  }, [folders, setFolders]);

  return (
    <>
      <ClientOnly fallback={'Loading...'}>
        {() => (
          <ReactFolderTree
            data={{
              name: 'First',
              children: [{ name: 'wow' }, { name: 'wow2', children: [] }],
            }}
            showCheckbox={false}
            initOpenStatus={'open'}
            iconComponents={{
              // FolderIcon: () => <IconFolder />,
              // FolderOpenIcon: () => <IconFolder />,
              // FileIcon: () => <IconFileCode2 />,
              // OKIcon: () => <IconCheck size={18} />,
              // // Toolbar icons
              EditIcon: ({ onClick, nodeData }) => (
                <IconPencil
                  size={18}
                  onClick={() => {
                    console.log(nodeData, onClick());
                    onClick();
                  }}
                />
              ),
              // DeleteIcon: () => <IconTrash size={18} />,
              // CancelIcon: () => <IconX size={18} />,
              // AddFileIcon: () => <IconFilePlus size={18} />,
              // AddFolderIcon: () => <IconFolderPlus size={18} />,
            }}
          />
        )}
      </ClientOnly>
      {/* <List>
        {folders.map((folder) => (
          <List.Item value={folder.label} key={folder.id} icon={<IconFolder />}>
            <Text>{folder.label}</Text>
            {folder.questions.length > 0 ? (
              <List icon={<IconFileCode2 />}>
                {folder.questions.map((question) => (
                  <List.Item key={question}>{question}</List.Item>
                ))}
              </List>
            ) : (
              <Group>
                <IconX />
                <Text>Empty</Text>
              </Group>
            )}
            <Button.Group>
              <Button variant={'default'} onClick={handler.open}>
                Add folder
              </Button>
              <Button variant={'default'}>Add question</Button>
            </Button.Group>
          </List.Item>
        ))}
      </List> */}
      {/* <ReactTree
        containerStyles={{ padding: 0 }}
        nodes={folders}
        theme={'defaultTheme'}
        themes={treeTheme}
        enableItemAnimations
        RenderNode={({ node }) => {
          return (
            <Flex align={'center'} gap={20} mt={5}>
              {isOpen && (
                <Modal
                  opened={isOpen}
                  onClose={handler.close}
                  withCloseButton={false}
                  centered
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const id = uuid4();
                      const newState = [...folders];
                      newState.push({
                        label: folderName,
                        id,
                        parentId: node.id,
                        questions: [],
                      });
                      setNewFolders(newState);
                      handler.toggle();
                      setFolderName('');
                    }}
                  >
                    <Text size="sm">Name of the new folder</Text>
                    <Flex align={'center'} mt={'md'} gap={'md'}>
                      <TextInput
                        autoFocus={true}
                        value={folderName}
                        placeholder="Folder name"
                        onChange={(e) => setFolderName(e.currentTarget.value)}
                      />
                      <Button type={'submit'}>Create</Button>
                    </Flex>
                  </form>
                </Modal>
              )}
              <Text>{node.label}</Text>

            </Flex>
          );
        }}
        RenderIcon={({ type }) => {
          return (
            <Box>{type === 'leaf' ? <IconFileCode2 /> : <IconFolder />}</Box>
          );
        }}
      /> */}
    </>
  );
};
