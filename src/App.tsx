import React, { useState } from 'react';
import Todo from '../src/pages/Todo';
import UserAuthentication from '../src/pages/UserAuthentication';
import { createTheme,colors,ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette:{
    secondary:{
      main: colors.orange[500]
    }
  }
})
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 // add login 
 const handleLogin =()=> {

  setIsLoggedIn(!isLoggedIn)
 }
    return (
  <ThemeProvider theme={theme}>
    {isLoggedIn ? (
      <UserAuthentication  />
      
      ) : (
        <Todo/>
      )}

</ThemeProvider>
      
    );
};

export default App;