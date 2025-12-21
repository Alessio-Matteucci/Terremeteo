import { Box } from '@mui/material';
import logoImage from '../assets/logo_TerreMeteo.png';

/**
 * Componente Logo con immagine migliorata
 */
export default function LogoWithImage({ size = 'medium', showText = false }) {
  const sizes = {
    small: { height: '40px', padding: '6px 12px' },
    medium: { height: '52px', padding: '8px 18px' },
    large: { height: '80px', padding: '12px 24px' },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Box
      sx={{
        padding: currentSize.padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="TerreMeteo Logo"
        sx={{
          height: currentSize.height,
          width: 'auto',
          objectFit: 'contain',
          maxWidth: { xs: '150px', sm: '200px', md: '250px' },
          filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))',
        }}
      />
      {showText && (
        <Box
          component="span"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}
        >
          TerreMeteo
        </Box>
      )}
    </Box>
  );
}
