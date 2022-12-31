import {
  Anchor,
  Box,
  Button,
  Center,
  Code,
  Container,
  createStyles,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { SUCCESSFUL_REDIRECT_PATH } from '../constants';

const useStyles = createStyles((theme) => ({
  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120
    }
  },

  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32
    }
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    color: theme.colors[theme.primaryColor][1]
  }
}));

interface ErrorPageProps {
  statusCode: number;
  message: string;
  description?: string;
  stack?: string;
}

export function ErrorPage({
  statusCode,
  message,
  description,
  stack
}: ErrorPageProps) {
  const { classes } = useStyles();

  return (
    <Center h={'100%'}>
      <Stack>
        <Box className={classes.label}>{statusCode}</Box>
        <Title className={classes.title}>{message}</Title>
        {description && (
          <Text size="lg" align="center" className={classes.description}>
            {description}
          </Text>
        )}
        <Group position="center">
          <Anchor href={SUCCESSFUL_REDIRECT_PATH}>
            <Button variant="white" size="md">
              Go back to home
            </Button>
          </Anchor>
        </Group>
        {stack && (
          <Container>
            <Paper p={'sm'} withBorder>
              <ScrollArea h={100}>
                <Code color={'red'}>
                  {process.env.NODE_ENV === 'development' && stack}
                </Code>
              </ScrollArea>
            </Paper>
          </Container>
        )}
      </Stack>
    </Center>
  );
}
