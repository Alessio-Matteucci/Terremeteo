import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../Components/logo';

/**
 * Pagina 404 - Pagina non trovata
 */
export default function NotFoundPage() {
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
        
        <Typography variant="h1" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '4rem', sm: '6rem', md: '8rem' } }}>
          404
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Pagina Non Trovata
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Sembra che tu abbia perso la strada...
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
          La pagina che stai cercando non esiste o è stata spostata.
          Torna alla home per continuare l'esplorazione del meteo mondiale.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
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
            Torna alla Home
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/explore')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Vai all'Esplorazione
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

