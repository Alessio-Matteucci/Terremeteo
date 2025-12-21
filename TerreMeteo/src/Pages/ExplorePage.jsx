import { useState } from 'react';
import { Box, Container } from '@mui/material';
import SearchBar from '../Components/SearchBar';
import Globe3D from '../Components/Globo3D';
import WeatherPanel from '../Components/panneloMeteo';
import PopularLocations from '../Components/LuoghiPopolari';
import RecentSearches, { useSaveRecentSearch } from '../Components/UltimeRicerche';
import LoadingSpinner from '../Components/CaricamentoAPI';
import { useLocationSelection } from '../hooks/useLocationSelection';
import { useWeatherData } from '../hooks/useWeatherData';

/**
 * Pagina principale con globo 3D, ricerca e dati meteo
 */
export default function ExplorePage() {
  const {
    selectedLocation,
    isAnimating,
    handleLocationSelect,
    handleResetView,
    handleGlobePickLocation,
  } = useLocationSelection();

  const { weatherData, isLoading: isLoadingWeather } = useWeatherData(selectedLocation);
  const { saveSearch } = useSaveRecentSearch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Salva la ricerca quando viene selezionata una location
  const handleLocationSelectWithSave = (location) => {
    handleLocationSelect(location);
    if (location && location.latitude && location.longitude && location.name) {
      saveSearch(location);
      // Incrementa il trigger per aggiornare la lista
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Handler per il click sul globo
  const handleGlobePickLocationWithSave = (latitude, longitude) => {
    handleGlobePickLocation(latitude, longitude);
    // Salva anche quando si clicca sul globo
    if (latitude && longitude) {
      saveSearch({
        latitude,
        longitude,
        name: 'Punto selezionato',
        country: 'Coordinate',
        admin1: null,
      });
      // Incrementa il trigger per aggiornare la lista
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Barra di ricerca - posizionata sopra la mappa in modo assoluto */}
        <Box 
          sx={{ 
            position: { xs: 'relative', sm: 'absolute' },
            top: { xs: 'auto', sm: 20 },
            left: { xs: 'auto', sm: '50%' },
            transform: { xs: 'none', sm: 'translateX(-50%)' },
            width: '100%',
            maxWidth: { xs: '100%', sm: 600 },
            zIndex: 10,
            px: { xs: 1, sm: 2 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <SearchBar onCitySelect={handleLocationSelectWithSave} />
        </Box>

        {/* Globo 3D */}
        <Box
          sx={{
            height: { xs: '40vh', sm: '50vh', md: '60vh' },
            minHeight: { xs: 300, sm: 400, md: 500 },
            position: 'relative',
            mb: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 2, sm: 8, md: 10 },
            borderRadius: { xs: '8px', sm: '12px' },
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Globe3D
            targetLat={selectedLocation?.latitude || null}
            targetLon={selectedLocation?.longitude || null}
            isAnimating={isAnimating}
            onPickLocation={handleGlobePickLocationWithSave}
            weatherData={weatherData}
            locationData={selectedLocation}
            onResetView={handleResetView}
          />
        </Box>

        {/* Layout dinamico: Default = [Posti Famosi] [Ultime Ricerche], Con ricerca = [Ultime Ricerche] [Dati Meteo] */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, sm: 3, md: 3 },
            alignItems: { xs: 'stretch', md: 'stretch' },
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: { xs: 'auto', md: '500px' },
          }}
        >
          {/* Posti Famosi - visibili solo quando NON c'è una ricerca */}
          {!selectedLocation && (
            <Box
              sx={{
                flex: { xs: '1 1 100%', md: '0 0 48%' },
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: { xs: '100%', md: '300px' },
                maxWidth: { xs: '100%', md: '48%' },
                display: 'flex',
                flexDirection: 'column',
                opacity: selectedLocation ? 0 : 1,
                transform: selectedLocation ? 'translateX(-20px)' : 'translateX(0)',
              }}
            >
              <PopularLocations onLocationSelect={handleLocationSelectWithSave} />
            </Box>
          )}

          {/* Ultime Ricerche - sempre visibili, si sposta a sinistra quando c'è una ricerca */}
          <Box
            sx={{
              flex: selectedLocation 
                ? { xs: '1 1 100%', md: '0 0 45%' } 
                : { xs: '1 1 100%', md: '0 0 48%' },
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: { xs: '100%', md: '300px' },
              maxWidth: selectedLocation 
                ? { xs: '100%', md: '45%' } 
                : { xs: '100%', md: '48%' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RecentSearches 
              onLocationSelect={handleLocationSelectWithSave} 
              refreshTrigger={refreshTrigger}
            />
          </Box>

          {/* Pannello meteo - appare a destra quando c'è una ricerca */}
          {selectedLocation && (
            <Box
              sx={{
                flex: { xs: '1 1 100%', md: '0 0 52%' },
                opacity: isLoadingWeather ? 0 : 1,
                transform: isLoadingWeather ? 'translateX(20px)' : 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: { xs: '100%', md: '300px' },
                maxWidth: { xs: '100%', md: '52%' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isLoadingWeather ? (
                <LoadingSpinner message="Caricamento dati meteo..." />
              ) : (
                <WeatherPanel
                  weatherData={weatherData}
                  locationData={selectedLocation}
                />
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

