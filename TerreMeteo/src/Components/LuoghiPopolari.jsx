import { Box, Typography, Grid, Paper, Button } from '@mui/material';

/**
 * Componente per visualizzare luoghi popolari da selezionare rapidamente
 */
export default function PopularLocations({ onLocationSelect }) {
  const popularLocations = [
    { name: 'Roma', country: 'Italia', latitude: 41.9028, longitude: 12.4964, admin1: 'Lazio' },
    { name: 'Milano', country: 'Italia', latitude: 45.4642, longitude: 9.1900, admin1: 'Lombardia' },
    { name: 'New York', country: 'Stati Uniti', latitude: 40.7128, longitude: -74.0060, admin1: 'New York' },
    { name: 'Londra', country: 'Regno Unito', latitude: 51.5074, longitude: -0.1278, admin1: 'Inghilterra' },
    { name: 'Parigi', country: 'Francia', latitude: 48.8566, longitude: 2.3522, admin1: 'Île-de-France' },
    { name: 'Tokyo', country: 'Giappone', latitude: 35.6762, longitude: 139.6503, admin1: 'Tokyo' },
    { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, admin1: 'New South Wales' },
    { name: 'Dubai', country: 'Emirati Arabi Uniti', latitude: 25.2048, longitude: 55.2708, admin1: 'Dubai' },
  ];

  const handleLocationClick = (location) => {
    onLocationSelect(location);
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'white', 
          mb: 3, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Luoghi Popolari
      </Typography>
      
      <Grid container spacing={2}>
        {popularLocations.map((location, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Button
              fullWidth
              onClick={() => handleLocationClick(location)}
              sx={{
                p: 0,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 0.2s',
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    mb: 0.5
                  }}
                >
                  {location.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'block'
                  }}
                >
                  {location.country}
                </Typography>
              </Paper>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

