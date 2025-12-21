import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import WelcomePage from './Pages/WelcomePage';
import ExplorePage from './Pages/ExplorePage';
import MediaPage from './Pages/MediaPage';
import NotFoundPage from './ErrorPages/NotFoundPage';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css';

// Tema scuro personalizzato con gradazione blu cielo
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3282b8',
      light: '#bbe1fa',
      dark: '#0f4c75',
    },
    secondary: {
      main: '#42a5f5',
      light: '#90caf9',
      dark: '#1565c0',
    },
    background: {
      default: '#0a1929',
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/robots.txt" element={"robots.txt"} />
            </Routes>
          </Box>
          {/* <Footer /> */}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
