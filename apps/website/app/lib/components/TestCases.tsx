import { ActionIcon, Flex, Select, TextInput } from '@mantine/core';
import { IconMinus } from '@tabler/icons';
import { guessDataType } from '../utils';
import type { TestCaseUnit } from ':generated/graphql/orchestrator/graphql';
import type { ChangeEventHandler, MouseEventHandler } from 'react';

type TestCaseProps = {
  textValue: string;
  onTextChange: ChangeEventHandler<HTMLInputElement>;
  testCaseUnits: TestCaseUnit[];

  selectValue: string;
  onSelectChange: (value: string) => void;

  actionBtnHandler: MouseEventHandler<HTMLButtonElement>;
};

export const TestCaseInput = ({
  textValue,
  onTextChange,
  testCaseUnits,
  selectValue,
  onSelectChange,
  actionBtnHandler,
}: TestCaseProps) => {
  return (
    <Flex gap={10} align={'center'}>
      <TextInput
        required
        value={textValue}
        label="Data"
        onChange={(e) => {
          onTextChange(e);
          const dataType = guessDataType(e.currentTarget.value);
          onSelectChange(dataType);
        }}
      />
      <Select
        required
        data={testCaseUnits}
        value={selectValue}
        label="Data type"
        onChange={onSelectChange}
      />
      <ActionIcon mt={20} variant="filled" onClick={actionBtnHandler}>
        <IconMinus size={20} />
      </ActionIcon>
    </Flex>
  );
};
