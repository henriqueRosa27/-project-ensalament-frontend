import React from 'react';
import {
  makeStyles,
  AppBar,
  Fab,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Menu, ExitToAppOutlined } from '@material-ui/icons';

import { useGlobals } from '../../../hooks/GlobalsContext';
import { useSignOut } from '../../../hooks/Session/SignOutContext';
import history from '../../../routes/history';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  hamburger: {
    marginRight: theme.spacing(2),
    color: 'inherit',
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  userIcon: {
    marginLeft: 10,
  },
  button: {
    padding: '0 15px !important',
    background: 'transparent',
    color: 'white',
    boxShadow: 'none',
    border: '1px solid white',
    '&:hover': {
      background: 'rgba(255, 255, 255, .1)',
    },
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();

  const { signOut } = useSignOut();
  const { toogleDrawer } = useGlobals();

  const logout = () => {
    signOut();
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.container}>
            <IconButton
              aria-label="Open drawer"
              edge="start"
              onClick={toogleDrawer}
              className={classes.hamburger}>
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>
              Ensalamento
            </Typography>
            <div className={classes.grow} />
          </div>
          <div>
            <Fab
              size="small"
              variant="extended"
              color="default"
              className={classes.button}
              onClick={logout}>
              Sair
              <ExitToAppOutlined className={classes.userIcon} />
            </Fab>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
