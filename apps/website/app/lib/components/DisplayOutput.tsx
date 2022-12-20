import {
  Code,
  createStyles,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import type { ExecuteCodeErrorStep } from ':generated/graphql/orchestrator/generated/graphql';

interface SuccessProps {
  type: 'success';
  successOutput: string;
  successStepTimings: { compilation: string; execution: string };
}

interface ErrorProps {
  type: 'error';
  errorOutput: string;
  errorStep: ExecuteCodeErrorStep;
}

type DisplayOutputProps = SuccessProps | ErrorProps;

const useStyles = createStyles((theme) => ({
  timeText: { fontSize: theme.fontSizes.md },
}));

export const DisplayOutput = (props: DisplayOutputProps) => {
  const { classes } = useStyles();
  return (
    <ScrollArea h={250}>
      <Paper withBorder p="md">
        {props.type === 'success' ? (
          <Stack>
            <Flex gap={10}>
              <Tooltip label={'Compilation time'}>
                <Code color={'yellow'} p={'xs'} className={classes.timeText}>
                  {props.successStepTimings.compilation}
                </Code>
              </Tooltip>
              <Tooltip label={'Execution time'}>
                <Code color={'blue'} p={'xs'} className={classes.timeText}>
                  {props.successStepTimings.execution}
                </Code>
              </Tooltip>
            </Flex>
            <Code>{props.successOutput}</Code>
          </Stack>
        ) : (
          <Stack>
            <Text>
              Encountered an error in the{' '}
              <Text span td={'underline'}>
                {props.errorStep}
              </Text>{' '}
              step:
            </Text>
            <Code color={'red'} block>
              {props.errorOutput}
            </Code>
          </Stack>
        )}
      </Paper>
    </ScrollArea>
  );
};
