import {
  Code,
  createStyles,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import type { ExecuteCodeErrorStep } from ':generated/graphql/orchestrator/graphql';

const useStyles = createStyles((theme) => ({
  timeText: { fontSize: theme.fontSizes.md }
}));

interface SuccessProps {
  successOutput: string;
  successStepTimings: { compilation: string; execution: string };
}

const DisplayOutputWrapper = ({ children }: { children: JSX.Element }) => {
  return (
    <ScrollArea h={250}>
      <Paper withBorder p="md">
        <Stack>{children}</Stack>
      </Paper>
    </ScrollArea>
  );
};

export const DisplaySuccessOutput = ({
  successOutput,
  successStepTimings
}: SuccessProps) => {
  const { classes } = useStyles();
  return (
    <DisplayOutputWrapper>
      <>
        <Flex gap={10}>
          <Tooltip label={'Compilation time'}>
            <Code color={'yellow'} p={'xs'} className={classes.timeText}>
              {successStepTimings.compilation}
            </Code>
          </Tooltip>
          <Tooltip label={'Execution time'}>
            <Code color={'blue'} p={'xs'} className={classes.timeText}>
              {successStepTimings.execution}
            </Code>
          </Tooltip>
        </Flex>
        <Code block>{successOutput}</Code>
      </>
    </DisplayOutputWrapper>
  );
};

interface ErrorProps {
  errorOutput: string;
  errorStep: ExecuteCodeErrorStep;
}

export const DisplayErrorOutput = ({ errorOutput, errorStep }: ErrorProps) => {
  return (
    <DisplayOutputWrapper>
      <>
        <Text>
          Encountered an error in the{' '}
          <Text span td={'underline'}>
            {errorStep}
          </Text>{' '}
          step:
        </Text>
        <Code color={'red'} block>
          {errorOutput}
        </Code>
      </>
    </DisplayOutputWrapper>
  );
};
