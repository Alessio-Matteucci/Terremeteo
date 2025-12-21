import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fotoHome from '../assets/foto_home.jpg';

/**
 * Pagina di benvenuto/introduzione
 */
export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #bbe1fa 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        px: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(187, 225, 250, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(50, 130, 184, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" sx={{ 
          mb: { xs: 2, sm: 2.5, md: 3 }, 
          fontWeight: 'bold',
          fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}>
          TerreMeteo
        </Typography>
        
        <Typography variant="h5" sx={{ 
          mb: { xs: 2, sm: 3, md: 4 }, 
          opacity: 0.95,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}>
          Esplora il meteo e il clima di qualsiasi località del mondo
        </Typography>

        {/* Immagine fotoHome */}
        <Box
          sx={{
            mb: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={fotoHome}
            alt="TerreMeteo Home"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '600px', md: '700px' },
              height: 'auto',
              borderRadius: '25px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              objectFit: 'cover',
            }}
          />
        </Box>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/explore')}
          sx={{
            px: { xs: 4, sm: 5, md: 6 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            backgroundColor: 'white',
            color: '#0f4c75',
            fontWeight: 600,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Inizia l'Esplorazione
        </Button>
      </Container>
    </Box>
  );
}

