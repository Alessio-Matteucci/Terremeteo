import { Box, Typography, Button } from '@mui/material';

/**
 * Componente per mostrare luoghi popolari da selezionare rapidamente
 */
export default function PopularLocations({ onLocationSelect }) {
  const popularCities = [
    { name: 'Roma', country: 'Italia', lat: 41.9028, lon: 12.4964 },
    { name: 'Milano', country: 'Italia', lat: 45.4642, lon: 9.1900 },
    { name: 'Parigi', country: 'Francia', lat: 48.8566, lon: 2.3522 },
    { name: 'Londra', country: 'Regno Unito', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', country: 'Giappone', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Dubai', country: 'Emirati Arabi', lat: 25.2048, lon: 55.2708 },
  ];

  const handleClick = (city) => {
    onLocationSelect({
      latitude: city.lat,
      longitude: city.lon,
      name: city.name,
      country: city.country,
    });
  };

  return (
    <Box 
      sx={{ 
        mt: 4, 
        mb: 4,
        backgroundColor: 'rgba(26, 26, 46, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
      }}
    >
      {/* Parte superiore con div più opaco */}
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '16px',
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            I Posti Più Cercati
          </Typography>
        </Box>
      </Box>

      {/* Lista dei chip delle città */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: '10px', sm: '14px', md: '18px' },
          padding: '16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', sm: 'space-evenly' },
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(102, 126, 234, 0.5)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.7)',
            },
          },
        }}
      >
        {popularCities.map((city, index) => (
          <Button
            key={index}
            onClick={() => handleClick(city)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: { xs: '14px 24px', sm: '16px 28px', md: '18px 32px' },
              borderRadius: '9999px',
              background: 'rgba(102, 126, 234, 0.15)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              fontSize: { xs: '16px', sm: '17px', md: '18px' },
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'none',
              transition: 'all 200ms ease',
              flex: { xs: '0 0 auto', sm: '1 1 auto' },
              minWidth: { xs: 'fit-content', sm: '120px', md: '140px' },
              maxWidth: { sm: '200px', md: '220px' },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                backgroundColor: 'rgba(102, 126, 234, 0.25)',
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
            }}
          >
            {city.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

