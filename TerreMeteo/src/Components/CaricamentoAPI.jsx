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
      <CircularProgress sx={{ color: 'white', mb: 2 }} />
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {message}
      </Typography>
    </Box>
  );
}
