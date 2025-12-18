import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../Components/logo';

/**
 * Pagina di benvenuto/introduzione
 */
export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Logo />
        </Box>
        
        <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
          TerreMeteo
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Esplora il meteo e il clima di qualsiasi località del mondo
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
          Un'esperienza immersiva che ti permette di navigare un globo 3D interattivo,
          cercare qualsiasi città e visualizzare informazioni meteorologiche aggiornate
          in tempo reale.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/explore')}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.2rem',
            backgroundColor: 'white',
            color: '#667eea',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          Inizia l'Esplorazione
        </Button>
      </Container>
    </Box>
  );
}

