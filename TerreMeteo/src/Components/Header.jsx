import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from './logo';

/**
 * Componente Header con logo in alto a sinistra
 */
export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        padding: { xs: '16px', sm: '20px', md: '24px' },
        pointerEvents: 'none',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          pointerEvents: 'auto',
          display: 'inline-block',
        }}
      >
        <Logo />
      </Link>
    </Box>
  );
}
