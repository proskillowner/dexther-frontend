import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export const CssSelect = styled(Select)(() => ({
  width: 300,
  color: "#ffffff",
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#A0AAB4"
    },
    "&:hover fieldset": {
      borderColor: "#ffffff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A0AAB4"
    },
    "& .MuiSvgIcon-root": {
      color: "#ffffff",
    },
  }
}));

export const CssTextField = styled(TextField)({
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

export const style = {
  position: "fixed",
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "flex-end",
};
