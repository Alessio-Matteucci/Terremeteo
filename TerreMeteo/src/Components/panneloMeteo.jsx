import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherService';

/**
 * Componente per visualizzare i dati meteorologici e geografici
 */
export default function WeatherPanel({ weatherData, locationData }) {
  if (!weatherData || !locationData) {
    return null;
  }

  const current = weatherData.current;
  const daily = weatherData.daily;
  const formatCoord = (value, posLabel, negLabel) => {
    const n = Number(value);
    const label = n >= 0 ? posLabel : negLabel;
    return `${Math.abs(n).toFixed(4)}°${label}`;
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          backgroundColor: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Informazioni geografiche */}
        <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
          {locationData.name}
          {locationData.admin1 && `, ${locationData.admin1}`}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          {(locationData.country || '—')} • {formatCoord(locationData.latitude, 'N', 'S')},{' '}
          {formatCoord(locationData.longitude, 'E', 'W')}
        </Typography>

        <Divider sx={{ 
          my: 3, 
          backgroundColor: 'rgba(102, 126, 234, 0.3)',
          height: '1px',
        }} />

        {/* Dati meteo attuali */}
        {current && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Condizioni Attuali
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ color: 'white', mb: 1 }}>
                    {getWeatherIcon(current.weather_code)}
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {current.temperature_2m.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {getWeatherDescription(current.weather_code)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Umidità
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {current.relative_humidity_2m}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Vento
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {current.wind_speed_10m.toFixed(1)} km/h
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Direzione: {current.wind_direction_10m}°
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Ora locale
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
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
            <Typography variant="h5" sx={{ color: 'white', mb: 2, mt: 3 }}>
              Previsioni 7 Giorni
            </Typography>
            <Grid container spacing={2}>
              {daily.time.slice(0, 7).map((date, index) => (
                <Grid item xs={6} sm={4} md={12 / 7} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 200ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.15)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      {new Date(date).toLocaleDateString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
                      {getWeatherIcon(daily.weather_code[index])}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {daily.temperature_2m_max[index].toFixed(0)}°
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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