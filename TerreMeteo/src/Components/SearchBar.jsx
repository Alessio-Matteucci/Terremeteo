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
        placeholder="Cerca una cittÃ ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        }}
      />
      
      {showResults && results.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            zIndex: 1000,
          }}
        >
          <List>
            {results.map((city, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleCitySelect(city)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  );
}