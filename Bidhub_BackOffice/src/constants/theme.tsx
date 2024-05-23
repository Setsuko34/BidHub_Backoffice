import { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

export const theme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFA31A',
      light: '#ffb547',
      dark: '#b27212',
    },
    secondary: {
      main: '#2c2c2c',
      light: '#565656',
      dark: '#1e1e1e',
    },
  },
});