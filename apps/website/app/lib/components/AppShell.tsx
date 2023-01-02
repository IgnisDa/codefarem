import {
  createStyles,
  Navbar,
  MediaQuery,
  Title,
  Center,
  Anchor,
  Text,
  UnstyledButton,
  Box,
  Flex,
  Menu,
  Group
} from '@mantine/core';
import {
  IconLogout,
  IconCode,
  IconQuestionMark,
  IconSchool,
  IconInfoCircle,
  IconChevronRight
} from '@tabler/icons';
import { route } from 'routes-gen';
import { LinksGroup } from './LinksGroup';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colors.dark[4]}`
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colors.dark[4]}`
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.dark[1],
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': { color: theme.white }
    },

    linkIcon: {
      ref: icon,
      color: theme.colors.dark[2],
      marginRight: theme.spacing.sm
    }
  };
});

const navbarLinks = [
  {
    label: 'Playground',
    icon: IconCode,
    links: [
      {
        link: route('/playground'),
        label: 'Code'
      }
    ]
  },
  {
    label: 'Classes',
    icon: IconSchool,
    links: [{ link: route('/classes'), label: 'List' }]
  },
  {
    label: 'Questions',
    icon: IconQuestionMark,
    links: [
      {
        link: route('/questions'),
        label: 'List'
      }
    ]
  },
  {
    label: 'Information',
    icon: IconInfoCircle,
    links: [
      {
        link: route('/information/toolchain'),
        label: 'Toolchain'
      }
    ]
  }
];

const userActions = [
  {
    label: 'Logout',
    icon: IconLogout,
    link: route('/auth/logout')
  },
  {
    label: 'Profile',
    icon: IconChevronRight,
    link: route('/profile')
  }
];

interface NavbarProps {
  username: string;
  email: string;
  profileAvatarSvg: string;
}

export const AppNavbar = ({
  username,
  email,
  profileAvatarSvg
}: NavbarProps) => {
  const { classes } = useStyles();
  const links = navbarLinks.map((item, idx) => (
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
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton py={'xs'} w={'100%'}>
                <Group position='apart'>
                  <Flex align={'center'} gap={10}>
                    <Box
                      h={'35px'}
                      w={'35px'}
                      // rome-ignore lint/security/noDangerouslySetInnerHtml: generated on the server
                      dangerouslySetInnerHTML={{ __html: profileAvatarSvg }}
                    />
                    <Box style={{ flex: 1 }}>
                      <Text
                        size="sm"
                        fz={'xl'}
                        variant={'gradient'}
                        gradient={{ from: '#FF512F', to: '#DD2476' }}
                      >
                        {username}
                      </Text>
                      <Text color="dimmed" size="xs">
                        {email}
                      </Text>
                    </Box>
                  </Flex>
                  <IconChevronRight size={14} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {userActions.map((action) => (
                <Menu.Item icon={<action.icon />} key={action.label}>
                  <Anchor href={action.link} className={classes.link}>
                    <Text>{action.label}</Text>
                  </Anchor>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
};
