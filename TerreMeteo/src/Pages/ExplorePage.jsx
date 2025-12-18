import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import SearchBar from '../Components/SearchBar';
import Globe3D from '../Components/Globo3D';
import WeatherPanel from '../Components/panneloMeteo';
import PopularLocations from '../Components/LuoghiPopolari';
import LoadingSpinner from '../Components/CaricamentoAPI';
import { getWeatherData } from '../services/weatherService';

/**
 * Pagina principale con globo 3D, ricerca e dati meteo
 */
export default function ExplorePage() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      // Avvia animazione
      setIsAnimating(true);
      
      // Recupera dati meteo
      setIsLoadingWeather(true);
      const fetchWeather = async () => {
        const data = await getWeatherData(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        setWeatherData(data);
        setIsLoadingWeather(false);
      };

      fetchWeather();

      // Ferma animazione dopo un po'
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }
  }, [selectedLocation]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setWeatherData(null); // Reset dati meteo durante il caricamento
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Barra di ricerca */}
        <Box sx={{ mb: 4, zIndex: 10, position: 'relative' }}>
          <SearchBar onCitySelect={handleLocationSelect} />
        </Box>

        {/* Globo 3D */}
        <Box
          sx={{
            height: '60vh',
            minHeight: 500,
            position: 'relative',
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Globe3D
            targetLat={selectedLocation?.latitude || null}
            targetLon={selectedLocation?.longitude || null}
            isAnimating={isAnimating}
          />
        </Box>

        {/* Luoghi popolari */}
        <PopularLocations onLocationSelect={handleLocationSelect} />

        {/* Pannello meteo */}
        {selectedLocation && (
          <>
            {isLoadingWeather ? (
              <LoadingSpinner message="Caricamento dati meteo..." />
            ) : (
              <WeatherPanel
                weatherData={weatherData}
                locationData={selectedLocation}
              />
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

