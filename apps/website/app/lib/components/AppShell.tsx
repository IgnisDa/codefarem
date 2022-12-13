import {
  createStyles,
  Navbar,
  MediaQuery,
  Title,
  Center,
  Anchor,
  Text,
  Stack,
} from '@mantine/core';
import { IconLogout, IconBrandAppleArcade } from '@tabler/icons';
import { route } from 'routes-gen';
import { SupportedLanguage } from ':generated/graphql/orchestrator/generated/graphql';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },
  };
});

const data = [
  {
    link: route('/playground/:lang', { lang: SupportedLanguage.Rust }),
    label: 'Playground',
    icon: IconBrandAppleArcade,
  },
];

export const AppNavbar = () => {
  const { classes } = useStyles();

  return (
    <MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
      <Navbar width={{ xs: 0, sm: 200 }} p="md">
        <Navbar.Section>
          <Center className={classes.header}>
            <Title order={2}>CodeFarem</Title>
          </Center>
        </Navbar.Section>
        <Navbar.Section grow>
          <Stack>
            {data.map((item) => (
              <Anchor
                className={classes.link}
                href={item.link}
                key={item.label}
              >
                <item.icon className={classes.linkIcon} stroke={1.5} />
                <span>{item.label}</span>
              </Anchor>
            ))}
          </Stack>
        </Navbar.Section>
        <Navbar.Section className={classes.footer}>
          <Anchor href={route('/auth/logout')} className={classes.link}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <Text>Logout</Text>
          </Anchor>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
};
