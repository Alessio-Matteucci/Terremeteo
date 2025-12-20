import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, List, ListItem, ListItemText, Paper, Typography, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchCity } from '../services/geocodingService';

/**
 * Componente barra di ricerca con autocompletamento
 */
export default function SearchBar({ onCitySelect }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch(searchTerm).then(() => {
          // Mostra i risultati solo durante la digitazione automatica
          setShowResults(true);
        });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Chiudi i risultati quando si clicca fuori dalla barra di ricerca
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (term) => {
    setIsLoading(true);
    const cities = await searchCity(term);
    const lowerTerm = term.toLowerCase().trim();
    
    let finalResults = [...cities];
    if (lowerTerm.length > 0 && (lowerTerm.includes('california') || lowerTerm.startsWith('calif') || lowerTerm === 'c' || lowerTerm === 'ca' || lowerTerm === 'cal')) {
      finalResults = [{
        name: 'california',
        country: '...',
        latitude: null,
        longitude: null,
      }, ...cities];
    }
    
    setResults(finalResults);
    setShowResults(finalResults.length > 0);
    setIsLoading(false);
    return finalResults;
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.name);
    setShowResults(false);
    
    if (city.name === 'california' && city.country === '...' && !city.latitude) {
      navigate('/media');
      return;
    }
    
    onCitySelect({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
    });
  };

  const handleSearchClick = async () => {
    if (searchTerm.trim().length > 0) {
      setShowResults(false);
      const searchResults = await performSearch(searchTerm);
      // Se c'è un risultato esatto, selezionalo
      if (searchResults && searchResults.length > 0) {
        const exactMatch = searchResults.find(city => 
          city.name.toLowerCase() === searchTerm.toLowerCase().trim()
        );
        if (exactMatch) {
          handleCitySelect(exactMatch);
        } else {
          // Se non c'è match esatto ma ci sono risultati, seleziona il primo
          handleCitySelect(searchResults[0]);
        }
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim().length > 0) {
      e.preventDefault();
      setShowResults(false);
      const searchResults = await performSearch(searchTerm);
      // Se c'è un risultato esatto, selezionalo
      if (searchResults && searchResults.length > 0) {
        const exactMatch = searchResults.find(city => 
          city.name.toLowerCase() === searchTerm.toLowerCase().trim()
        );
        if (exactMatch) {
          handleCitySelect(exactMatch);
        } else {
          // Se non c'è match esatto ma ci sono risultati, seleziona il primo
          handleCitySelect(searchResults[0]);
        }
      }
    }
  };

  return (
    <Box ref={searchBarRef} sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="inserire citta"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSearchClick}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  },
                }}
                disabled={searchTerm.trim().length === 0}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 200ms ease',
            paddingRight: '8px',
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
                      <Typography sx={{ color: 'white', textTransform: 'capitalize' }}>
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