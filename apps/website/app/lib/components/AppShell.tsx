import {
  createStyles,
  Navbar,
  MediaQuery,
  Title,
  Center,
  Anchor,
  Text,
} from '@mantine/core';
import {
  IconLogout,
  IconCode,
  IconQuestionMark,
  IconSchool,
  IconInfoCircle,
} from '@tabler/icons';
import { route } from 'routes-gen';
import { LinksGroup } from './LinksGroup';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colors.dark[4]}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colors.dark[4]}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.dark[1],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colors.dark[6],
        color: theme.white,

        [`& .${icon}`]: {
          color: theme.white,
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
    label: 'Playground',
    icon: IconCode,
    links: [
      {
        link: route('/playground'),
        label: 'Code',
      },
    ],
  },
  {
    label: 'Classes',
    icon: IconSchool,
    links: [{ link: route('/classes'), label: 'List' }],
  },
  {
    label: 'Questions',
    icon: IconQuestionMark,
    links: [
      {
        link: route('/questions'),
        label: 'List',
      },
    ],
  },
  {
    label: 'Information',
    icon: IconInfoCircle,
    links: [
      {
        link: route('/information/toolchain'),
        label: 'Toolchain',
      },
    ],
  },
];

export const AppNavbar = () => {
  const { classes } = useStyles();
  const links = data.map((item, idx) => (
    <LinksGroup
      links={item.links}
      label={item.label}
      icon={item.icon}
      key={idx}
    />
  ));

  return (
    <MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
      <Navbar width={{ xs: 0, sm: 250 }} p="md">
        <Navbar.Section>
          <Center className={classes.header}>
            <Title order={2}>CodeFarem</Title>
          </Center>
        </Navbar.Section>
        <Navbar.Section grow>{links}</Navbar.Section>
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
