import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

/**
 * Pagina 404 - Pagina non trovata
 */
export default function NotFoundPage() {
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
        <Box 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={logoImage}
            alt="TerreMeteo Logo"
            sx={{
              height: { xs: '60px', sm: '80px', md: '100px' },
              width: 'auto',
              objectFit: 'contain',
              maxWidth: { xs: '200px', sm: '250px', md: '300px' },
            }}
          />
        </Box>
        
        <Typography variant="h1" sx={{ 
          mb: { xs: 2, sm: 2.5, md: 3 }, 
          fontWeight: 'bold', 
          fontSize: { xs: '3rem', sm: '5rem', md: '8rem' },
          lineHeight: 1,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(135deg, #ffffff 0%, #bbe1fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          404
        </Typography>
        
        <Typography variant="h4" sx={{ 
          mb: { xs: 1.5, sm: 2 }, 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}>
          Pagina Non Trovata
        </Typography>
        
        <Typography variant="h6" sx={{ 
          mb: { xs: 2, sm: 3, md: 4 }, 
          opacity: 0.95,
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        }}>
          Sembra che tu abbia perso la strada...
        </Typography>
        
        <Typography variant="body1" sx={{ 
          mb: { xs: 4, sm: 5, md: 6 }, 
          opacity: 0.9, 
          maxWidth: 600, 
          mx: 'auto',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          lineHeight: { xs: 1.6, sm: 1.75 },
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        }}>
          La pagina che stai cercando non esiste o è stata spostata.
          Torna alla home per continuare l'esplorazione del meteo mondiale.
          L'importante è non cercare mai la California!
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1.5, sm: 2 }, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'stretch',
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
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
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
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
              px: { xs: 4, sm: 5, md: 6 },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              borderColor: 'white',
              borderWidth: 2,
              color: 'white',
              fontWeight: 600,
              borderRadius: '12px',
              width: { xs: '100%', sm: 'auto' },
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
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

