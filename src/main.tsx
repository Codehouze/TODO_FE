import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { AuthProvider } from './context/AuthProvider.tsx'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Todo from './pages/Todo.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>


    <App />

  </React.StrictMode>,
)
