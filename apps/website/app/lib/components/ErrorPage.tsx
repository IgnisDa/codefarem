import {
  createStyles,
  Title,
  Text,
  Button,
  Group,
  Anchor,
  Box,
} from '@mantine/core';
import { SUCCESSFUL_REDIRECT_PATH } from '../constants';

const useStyles = createStyles((theme) => ({
  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][1],
  },
}));

interface ErrorPageProps {
  statusCode: number;
  message: string;
  description?: string;
}

export function ErrorPage({
  statusCode,
  message,
  description,
}: ErrorPageProps) {
  const { classes } = useStyles();

  return (
    <Box>
      <div className={classes.label}>{statusCode}</div>
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
    </Box>
  );
}
