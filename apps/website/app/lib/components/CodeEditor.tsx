import type { SupportedLanguage } from ':generated/graphql/orchestrator/generated/graphql';
import { Stack, Flex, Select, Button } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerPlay } from '@tabler/icons';
import Editor from '@monaco-editor/react';
import type { Dispatch, SetStateAction } from 'react';
import { showNotification } from '@mantine/notifications';

interface CodeEditorProps {
  supportedLanguages: SupportedLanguage[];
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
  onSubmit: () => Promise<void>;
  isSubmittingLoading: boolean;
}

export const CodeEditor = ({
  supportedLanguages,
  code,
  language,
  onSubmit,
  setCode,
  setLanguage,
  isSubmittingLoading,
}: CodeEditorProps) => {
  return (
    <Stack w={'100%'}>
      <Flex justify={'space-between'} align={'center'}>
        <Select
          data={supportedLanguages.map((l) => ({
            label: l.toUpperCase(),
            value: l,
          }))}
          value={language}
          onChange={(e) => setLanguage(e as SupportedLanguage)}
        />
        <Button
          variant={'default'}
          leftIcon={<IconDeviceFloppy size={24} />}
          onClick={() => {
            showNotification({
              title: 'System notification',
              message: 'This feature has not been implemented yet',
              color: 'red',
              autoClose: 5000,
            });
          }}
        >
          Save
        </Button>
      </Flex>
      <Editor
        options={{ lineNumbers: 'off' }}
        height={'50vh'}
        language={language}
        theme={'vs-dark'}
        value={code}
        onChange={(value) => setCode(value || '')}
      />
      <Flex justify={'space-between'} align={'center'}>
        {/* TODO: Remove this element */}
        <div></div>
        <Button
          leftIcon={<IconPlayerPlay size={24} />}
          loading={isSubmittingLoading}
          onClick={onSubmit}
        >
          Run Test Cases
        </Button>
      </Flex>
    </Stack>
  );
};
