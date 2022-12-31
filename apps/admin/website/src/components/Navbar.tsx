import { useState } from 'react';
import {
  Center,
  createStyles,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton
} from '@mantine/core';
import {
  IconCode,
  IconGauge,
  IconLogout,
  IconPlaylistAdd,
  IconSwitchHorizontal,
  TablerIcon
} from '@tabler/icons';
import { Link } from '@tanstack/react-router';

const useStyles = createStyles((theme) => ({
  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        color: theme.primaryColor,
        variant: 'light'
      }).background,
      color: theme.fn.variant({ color: theme.primaryColor, variant: 'light' })
        .color
    }
  },

  link: {
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0]
    },

    alignItems: 'center',
    borderRadius: theme.radius.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    display: 'flex',
    height: 50,
    justifyContent: 'center',
    width: 50
  }
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavbarButton = ({
  icon: Icon,
  label,
  active,
  onClick
}: NavbarLinkProps) => {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
};

const NavbarLink = ({
  icon: Icon,
  label,
  link,
  onClick
}: NavbarLinkProps & { link: string }) => (
  <Link to={link} search={{}} params={{}}>
    <NavbarButton label={label} onClick={onClick} icon={Icon} />
  </Link>
);

const mockData = [
  { icon: IconGauge, label: 'Dashboard', link: '/' },
  { icon: IconPlaylistAdd, label: 'Invite', link: '/invite' }
];

export const NavbarMinimal = () => {
  const [active, setActive] = useState(2);

  const links = mockData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => void setActive(index)}
    />
  ));

  return (
    <Navbar width={{ base: 80 }} p="md">
      <Center>
        <IconCode size={30} />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarButton icon={IconSwitchHorizontal} label="Change account" />
          <NavbarButton icon={IconLogout} label="Logout" />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
