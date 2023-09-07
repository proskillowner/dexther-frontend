import React from "react";
import { withTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import isEmail from 'validator/lib/isEmail';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import logo from "./media/logo.jpeg"
import { SERVER_URL, API_GET_USER } from './Api'


let email = ""
let password = ""

export const withNavigation = (Component) => {
  return props => <Component {...props} navigate={useNavigate()} />;
}

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
};

class Login extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)
    this.state = {
      showPassword: false,
      isEmailError: false,
      emailErrorMessage: null,
      isPasswordError: false,
      passwordErrorMessage: null,
      progressDialog: false
    }

    this.handleClickShowPassword = this.handleClickShowPassword.bind(this)
    this.submit = this.submit.bind(this)
    this.login = this.login.bind(this)
  }

  async login() {
    await fetch(`${SERVER_URL}${API_GET_USER}`, {
      method: 'POST',
      body: JSON.stringify({
        user_email: email,
        user_password: password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const { t } = this.props;
        if (!data.user_name) {
          this.setState({
            isPasswordError: true,
            passwordErrorMessage: t("invalid_email_or_password"),
            progressDialog: false
          })
        }
        else {
          this.setState({
            progressDialog: false
          })

          const { cookies } = this.props;
          cookies.set("user", JSON.stringify(data), { path: "/" }) // setting the cookie

          this.props.navigate('/dashboard', { replace: true });
        }
      })
      .catch((err) => {
        this.setState({
          progressDialog: false
        })
        alert(err.message)
      })

  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  emailOnChange = (event) => {
    email = event.target.value
  };

  passwordOnChange = (event) => {
    password = event.target.value
  };


  submit = (event) => {
    const { t } = this.props;

    var isEmailError = false
    var emailErrorMessage = null

    var isPasswordError = false
    var passwordErrorMessage = null

    if (email.trim().length == 0) {
      isEmailError = true
      emailErrorMessage = t("empty_email")
    }
    else
      if (!isEmail(email)) {
        isEmailError = true
        emailErrorMessage = t("invalid_email")
      }

    if (password.trim().length == 0) {
      isPasswordError = true
      passwordErrorMessage = t("empty_password")
    }
    else
      if (password.trim().length < 6) {
        isPasswordError = true
        passwordErrorMessage = t("invalid_password")
      }


    this.setState({
      isEmailError: isEmailError,
      emailErrorMessage: emailErrorMessage,
      isPasswordError: isPasswordError,
      passwordErrorMessage: passwordErrorMessage,
      progressDialog: !isEmailError && !isPasswordError
    })

    if (!isEmailError && !isPasswordError) {
      this.login()

    }

  }


  render() {
    const { t } = this.props;

    return <div className="App">
      <header className="App-header">
        <img src={logo} style={{ height: 200 }} />
        <div style={{ marginTop: 32 }}>
          <CssTextField id="email"
            sx={{ width: 250 }}
            label={t("email")}
            variant="outlined"
            error={this.state.isEmailError}
            helperText={this.state.emailErrorMessage}
            type="email"
            InputLabelProps={{
              shrink: true,
              className: "App-TextField"
            }}
            InputProps={{
              className: "App-TextField"
            }}
            onChange={this.emailOnChange}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <CssTextField id="filled-basic"
            sx={{ width: 250 }}
            error={this.state.isPasswordError}
            helperText={this.state.passwordErrorMessage}
            label={t("password")}
            variant="outlined"
            type={this.state.showPassword ? "text" : "password"}
            onChange={this.passwordOnChange}
            InputLabelProps={{
              shrink: true,
              className: "App-TextField"
            }}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    style={{ color: "#fff" }}
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                    edge="end"
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>,
              className: "App-TextField"
            }}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <Button variant="contained" sx={{ width: 250 }} onClick={this.submit}>{t("login")}</Button>
        </div>
        <Modal
          open={this.state.progressDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CircularProgress />
          </Box>
        </Modal>
      </header>
    </div>
  }
}

export default withNavigation(withCookies(withTranslation()(Login)));