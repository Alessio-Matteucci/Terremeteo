import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import WelcomePage from './Pages/WelcomePage';
import ExplorePage from './Pages/ExplorePage';
import MediaPage from './Pages/MediaPage';
import NotFoundPage from './ErrorPages/NotFoundPage';
import './App.css';

// Tema scuro personalizzato
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a2e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/robots.txt" element={"robots.txt"} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
