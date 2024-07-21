import './main.css'
import {App} from './App.jsx'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
    // </React.StrictMode>,
)
