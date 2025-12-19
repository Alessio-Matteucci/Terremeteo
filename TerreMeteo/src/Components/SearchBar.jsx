import { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { searchCity } from '../services/geocodingService';

/**
 * Componente barra di ricerca con autocompletamento
 */
export default function SearchBar({ onCitySelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch(searchTerm);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const performSearch = async (term) => {
    setIsLoading(true);
    const cities = await searchCity(term);
    setResults(cities);
    setShowResults(cities.length > 0);
    setIsLoading(false);
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.name);
    setShowResults(false);
    onCitySelect({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="inserire citta"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 200ms ease',
            '& fieldset': {
              borderColor: 'rgba(102, 126, 234, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(102, 126, 234, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(102, 126, 234, 0.8)',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      />
      
      <Box
        sx={{
          maxHeight: showResults && results.length > 0 ? '420px' : '0',
          overflow: 'hidden',
          transition: 'max-height 320ms ease',
          mt: 1,
        }}
      >
        {showResults && results.length > 0 && (
          <Paper
            sx={{
              borderRadius: '16px',
              maxHeight: 300,
              overflow: 'auto',
              backgroundColor: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                px: 2, 
                py: 1, 
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                Suggerimenti
              </Typography>
            </Box>
            <List>
              {results.map((city, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleCitySelect(city)}
                  sx={{
                    borderRadius: '12px',
                    mx: 1,
                    mb: 0.5,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.15)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ color: 'white' }}>
                        {city.name}
                        {city.admin1 && `, ${city.admin1}`}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                        {city.country}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}