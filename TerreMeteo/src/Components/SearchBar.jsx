import { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Paper, Typography, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCitySearch } from '../hooks/useCitySearch';
import { useClickOutside } from '../hooks/useClickOutside';
import { useSearchHandlers } from '../hooks/useSearchHandlers';

/**
 * Componente barra di ricerca con autocompletamento
 */
export default function SearchBar({ onCitySelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, isLoading, performSearch } = useCitySearch(searchTerm);
  const { handleCitySelect, handleSearchSubmit, handleKeyPress } = useSearchHandlers(onCitySelect);
  
  const searchBarRef = useClickOutside(() => {
    setShowResults(false);
  });

  useEffect(() => {
    if (searchTerm.trim().length > 2 && results.length > 0) {
      setShowResults(true);
    } else if (searchTerm.trim().length <= 2) {
      setShowResults(false);
    }
  }, [results, searchTerm]);

  const handleCityClick = (city) => {
    setSearchTerm(city.name);
    setShowResults(false);
    handleCitySelect(city);
  };

  const handleSearchClick = async () => {
    await handleSearchSubmit(searchTerm, performSearch, setShowResults);
  };

  const handleEnterKey = async (e) => {
    await handleKeyPress(e, searchTerm, performSearch, setShowResults);
  };

  return (
    <Box ref={searchBarRef} sx={{ position: 'relative', width: '100%', maxWidth: { xs: '100%', sm: 600 }, mx: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="inserire citta"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleEnterKey}
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
                  padding: { xs: '8px', sm: '12px' },
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(50, 130, 184, 0.2)',
                  },
                }}
                disabled={searchTerm.trim().length === 0}
              >
                <SearchIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: { xs: '12px', sm: '16px' },
            border: '1px solid rgba(50, 130, 184, 0.2)',
            transition: 'all 200ms ease',
            paddingRight: { xs: '4px', sm: '8px' },
            fontSize: { xs: '14px', sm: '16px' },
            '& fieldset': {
              borderColor: 'rgba(50, 130, 184, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(50, 130, 184, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(50, 130, 184, 0.8)',
              borderWidth: { xs: '1px', sm: '2px' },
            },
            '&.Mui-focused': {
              boxShadow: { xs: '0 0 0 2px rgba(50, 130, 184, 0.1)', sm: '0 0 0 4px rgba(50, 130, 184, 0.1)' },
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: { xs: '14px', sm: '16px' },
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
              borderRadius: { xs: '12px', sm: '16px' },
              maxHeight: { xs: 250, sm: 300 },
              overflow: 'auto',
              backgroundColor: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(50, 130, 184, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                px: { xs: 1.5, sm: 2 }, 
                py: { xs: 0.75, sm: 1 }, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                Suggerimenti
              </Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {results.map((city, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleCityClick(city)}
                  sx={{
                    borderRadius: { xs: '8px', sm: '12px' },
                    mx: { xs: 0.5, sm: 1 },
                    mb: { xs: 0.25, sm: 0.5 },
                    py: { xs: 0.75, sm: 1 },
                    transition: 'all 200ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(50, 130, 184, 0.15)',
                      transform: { xs: 'translateX(2px)', sm: 'translateX(4px)' },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ 
                        color: 'white', 
                        textTransform: 'capitalize',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}>
                        {city.name}
                        {city.admin1 && `, ${city.admin1}`}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      }}>
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