import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherService';
import { coordinateUtils } from '../hooks/useCoordinateConversion';

/**
 * Componente per visualizzare i dati meteorologici e geografici
 */
export default function WeatherPanel({ weatherData, locationData }) {
  if (!weatherData || !locationData) {
    return null;
  }

  const current = weatherData.current;
  const daily = weatherData.daily;
  const formatCoord = coordinateUtils.formatCoordinate;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          backgroundColor: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: { xs: '12px', sm: '16px' },
          border: '1px solid rgba(50, 130, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          maxHeight: { xs: 'none', md: 'calc(100vh - 200px)' },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(102, 126, 234, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.7)',
            },
          },
        }}
      >
        {/* Informazioni geografiche */}
        <Typography variant="h4" sx={{ 
          color: 'white', 
          mb: { xs: 1, sm: 1.5, md: 2 }, 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
        }}>
          {locationData.name}
          {locationData.admin1 && `, ${locationData.admin1}`}
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}>
          {(locationData.country || '—')} • {formatCoord(locationData.latitude, 'N', 'S')},{' '}
          {formatCoord(locationData.longitude, 'E', 'W')}
        </Typography>

        <Divider sx={{ 
          my: 3, 
          backgroundColor: 'rgba(50, 130, 184, 0.3)',
          height: '1px',
        }} />

        {/* Dati meteo attuali */}
        {current && (
          <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}>
              Condizioni Attuali
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ 
                    color: 'white', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  }}>
                    {getWeatherIcon(current.weather_code)}
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  }}>
                    {current.temperature_2m.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}>
                    {getWeatherDescription(current.weather_code)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}>
                    Umidità
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}>
                    {current.relative_humidity_2m}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}>
                    Vento
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}>
                    {current.wind_speed_10m.toFixed(1)} km/h
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: 'block',
                  }}>
                    Direzione: {current.wind_direction_10m}°
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}>
                    Ora locale
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}>
                    {new Date(current.time).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Previsioni giornaliere */}
        {daily && daily.time && daily.time.length > 0 && (
          <Box>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: { xs: 1.5, sm: 2 }, 
              mt: { xs: 2, sm: 2.5, md: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}>
              Previsioni 7 Giorni
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
              {daily.time.slice(0, 7).map((date, index) => (
                <Grid item xs={6} sm={4} md={12 / 7} key={index}>
                  <Paper
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      textAlign: 'center',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(50, 130, 184, 0.2)',
                      borderRadius: { xs: '10px', sm: '12px' },
                      transition: 'all 200ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(50, 130, 184, 0.15)',
                        transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
                        boxShadow: '0 4px 16px rgba(50, 130, 184, 0.3)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}>
                      {new Date(date).toLocaleDateString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      color: 'white', 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    }}>
                      {getWeatherIcon(daily.weather_code[index])}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                    }}>
                      {daily.temperature_2m_max[index].toFixed(0)}°
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: 'block',
                    }}>
                      {daily.temperature_2m_min[index].toFixed(0)}°
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}