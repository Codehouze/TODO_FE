import React, { useEffect, useState } from 'react';
import Todo from './pages/Todo';
import { createTheme,colors,ThemeProvider } from '@mui/material';
import {Route, Routes} from "react-router-dom";

import Layout from './component/layout';
// import RequireAuth from './component/RequireAuth';




const theme = createTheme({
  status:{
    danger:'#e53e3e',
  },
  palette:{
    secondary:{
      main: colors.red[700]
    }
  }
})
const App = () => {
 
    return (
  <ThemeProvider theme={theme}>
        
          <Todo /> 


  </ThemeProvider>
      
    );
};

export default App;