import { Button, Flex, Select, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Editor from '@monaco-editor/react';
import { IconDeviceFloppy, IconPlayerPlay } from '@tabler/icons';
import type { SupportedLanguage } from ':generated/graphql/orchestrator/graphql';
import type { Dispatch, SetStateAction } from 'react';

interface CodeEditorProps {
  supportedLanguages: SupportedLanguage[];
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
  onSubmit: () => Promise<void>;
  isSubmittingLoading: boolean;
  btnText: string;
  leftButton?: React.ReactNode;
}

export const CodeEditor = ({
  supportedLanguages,
  code,
  language,
  onSubmit,
  setCode,
  setLanguage,
  isSubmittingLoading,
  btnText,
  leftButton,
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
      <Flex justify={'end'} gap={'lg'} align={'center'}>
        {leftButton ? leftButton : <div></div>}
        <Button
          leftIcon={<IconPlayerPlay size={24} />}
          loading={isSubmittingLoading}
          onClick={onSubmit}
        >
          {btnText}
        </Button>
      </Flex>
    </Stack>
  );
};
