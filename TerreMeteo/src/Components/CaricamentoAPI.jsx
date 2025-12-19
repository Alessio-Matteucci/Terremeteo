import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente di caricamento
 */
export default function LoadingSpinner({ message = 'Caricamento...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#667eea', 
          mb: 2,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }} 
      />
      <Typography variant="body1" sx={{ 
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 500,
        letterSpacing: '0.5px',
      }}>
        {message}
      </Typography>
    </Box>
  );
}
