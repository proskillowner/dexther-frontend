import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import BackIcon from '@mui/icons-material/ArrowBack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import History from '@mui/icons-material/History';
import logo from '../media/logo.jpeg'

import { withTranslation } from 'react-i18next';

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

export const  withNavigation = (Component) => {
  return props => <Component {...props} navigate={useNavigate()} />;
} 

const drawerWidth = 0;
const navItems = ['Settings', 'Tables'];
/*onClick={handleDrawerToggle}*/
const drawer = (
    <Box  sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        HIC
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const menuId = 'primary-search-account-menu';
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#282c34',
      },
    },
  });

  //const container = window !== undefined ? () => window().document.body : undefined;

class TokarAppBar extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

    constructor(props) {
        super(props)

        this.state = {
          menuProfileVisible: false,
          menuProfileAnchorEl: null,
          confirmLogout: false,
        }

        this.onProfileMenuClick = this.onProfileMenuClick.bind(this)
        this.onProfileMenuClose = this.onProfileMenuClose.bind(this)

        this.onConfirmLogout = this.onConfirmLogout.bind(this)
        this.onLogoutCancel = this.onLogoutCancel.bind(this)
        this.onLogoutConfirmed = this.onLogoutConfirmed.bind(this)
        this.onReloadData = this.onReloadData.bind(this)
        this.onSettingsClick = this.onSettingsClick.bind(this)
        this.onTrailClick = this.onTrailClick.bind(this)
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this)

    }

    onProfileMenuClick(e) {
      this.setState({
          menuProfileVisible: true,
          menuProfileAnchorEl: e.target

      })
    }

    onProfileMenuClose() {
      this.setState(
        {
          menuProfileVisible: false,
          menuProfileAnchorEl: null
        }
      )
    }

    onConfirmLogout()  {
      this.setState({
        menuProfileVisible: false,
        menuProfileAnchorEl: null,
        confirmLogout: true
      })
    }

    onReloadData() {
      this.setState({
        menuProfileVisible: false,
        menuProfileAnchorEl: null,
      })

      this.props.onReloadData()
    }

    onLogoutCancel() {
      this.setState({
        confirmLogout: false
      })
    }

    onLogoutConfirmed() {
      const { cookies } = this.props;
      cookies.remove("user") // setting the cookie

      this.onLogoutCancel()
      this.props.navigate('/', { replace: true });
    }

    onSettingsClick() { 
      this.props.navigate('/settings', { replace: false });
    }

    onTrailClick() { 
      this.props.navigate('/trail', { replace: false });
    }

    handleDrawerToggle() {}
    

    render() {
        const { t } = this.props;

        return  <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <ThemeProvider theme={darkTheme}>
        <AppBar component="nav" color="primary" enableColorOnDark>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => this.props.navigate(-1)}
              sx={{ mr: 2, display: { sm: this.props.showBack ? 'inline' : 'none' } }}
            >
              <BackIcon  />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              <div style={{float: "left", width: 100, marginTop: 4}}>
                <div>
                  <img src={logo} style={{height:52}} />
                </div>
              </div>
              {t("app_name")}
              <div style={{fontSize: 14}}>
                {this.props.subTitle}
              </div>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block'} }}>   
            <IconButton
                style={{display: this.props.trail == "true" ? "none" : "none"}}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.onTrailClick}
                color="inherit"
            >
               <History />
            </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.onSettingsClick}
                color="inherit"
            >
               <Settings />
            </IconButton>   
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.onProfileMenuClick}
                color="inherit"
            >
               <AccountCircle />
            </IconButton>                                         
            </Box>
          </Toolbar>        
        
        </AppBar>  
        <Menu
            id="tables-menu"
            anchorEl={this.state.menuProfileAnchorEl}
            open={this.state.menuProfileVisible}
            onClose={this.onProfileMenuClose}
            MenuListProps={{
              'aria-labelledby': 'tables-button',
            }}
          >
            <MenuItem onClick={this.onReloadData} style={{display: "none"}}>
              {t("reload_data")}
            </MenuItem>
            <MenuItem onClick={this.onConfirmLogout} >
            {t("logout")}
            </MenuItem>
            
        </Menu>
        </ThemeProvider>   
        <Dialog
            PaperProps={{
              style: {
                backgroundColor: '#282c34',
                boxShadow: 'none',
                color: "#ffffff"
              },
            }}
          open={this.state.confirmLogout}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("logout")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" style={{color: "#ffffff"}}>
              {t("logout_confirm")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onLogoutConfirmed}>{t("ok")}</Button>
            <Button autoFocus onClick={this.onLogoutCancel}>
            {t("cancel")}
            </Button>
          </DialogActions>
      </Dialog>   
      </Box>
    }
}

export default withNavigation(withCookies(withTranslation()(TokarAppBar)));