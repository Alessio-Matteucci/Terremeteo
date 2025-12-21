import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Componente per mostrare le ultime ricerche effettuate
 */
export default function RecentSearches({ onLocationSelect, refreshTrigger }) {
  const [recentSearches, setRecentSearches] = useState([]);

  // Funzione per caricare le ricerche dal localStorage
  const loadSearches = () => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed);
      } catch (error) {
        console.error('Errore nel caricamento delle ricerche:', error);
      }
    } else {
      setRecentSearches([]);
    }
  };

  // Carica le ultime ricerche dal localStorage al mount e quando cambia refreshTrigger
  useEffect(() => {
    loadSearches();
  }, [refreshTrigger]);

  // Ascolta anche i cambiamenti nel localStorage (per aggiornamenti da altre tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'recentSearches') {
        loadSearches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Ascolta anche gli eventi custom per aggiornamenti nella stessa tab
    const handleCustomStorageChange = () => {
      loadSearches();
    };
    
    window.addEventListener('recentSearchesUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('recentSearchesUpdated', handleCustomStorageChange);
    };
  }, []);

  // Salva una nuova ricerca
  const saveSearch = (location) => {
    const searchItem = {
      name: location.name,
      country: location.country || '',
      latitude: location.latitude,
      longitude: location.longitude,
      admin1: location.admin1 || null,
      timestamp: Date.now(),
    };

    setRecentSearches((prev) => {
      // Rimuovi duplicati (stessa città)
      const filtered = prev.filter(
        (item) => item.name.toLowerCase() !== location.name.toLowerCase()
      );
      
      // Aggiungi la nuova ricerca all'inizio
      const updated = [searchItem, ...filtered].slice(0, 8); // Massimo 8 ricerche
      
      // Salva nel localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Espone la funzione saveSearch al componente padre
  useEffect(() => {
    if (onLocationSelect) {
      // Wrapper per salvare la ricerca quando viene selezionata
      const originalOnLocationSelect = onLocationSelect;
      // Questo verrà gestito dal componente padre
    }
  }, [onLocationSelect]);

  const handleClick = (search) => {
    onLocationSelect({
      latitude: search.latitude,
      longitude: search.longitude,
      name: search.name,
      country: search.country,
      admin1: search.admin1,
    });
  };

  // Se non ci sono ricerche, mostra un messaggio
  if (recentSearches.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%',
          backgroundColor: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: { xs: '12px', sm: '16px' },
          padding: { xs: '12px', sm: '16px', md: '20px' },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: { xs: '14px', sm: '15px', md: '16px' },
            textAlign: 'center',
          }}
        >
          Nessuna ricerca recente
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100%',
        backgroundColor: 'rgba(26, 26, 46, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: { xs: '12px', sm: '16px' },
        padding: { xs: '12px', sm: '16px', md: '20px' },
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Parte superiore con div più opaco */}
      <Box
        sx={{
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            borderRadius: { xs: '10px', sm: '12px' },
            padding: { xs: '10px 12px', sm: '12px 16px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: { xs: '14px', sm: '15px', md: '16px' },
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            Ultime Ricerche
          </Typography>
        </Box>
      </Box>

      {/* Lista delle ultime ricerche */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '8px', sm: '10px', md: '12px' },
          padding: { xs: '8px', sm: '12px', md: '16px' },
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          flex: 1,
          maxHeight: { xs: 'none', md: 'calc(100vh - 200px)' },
          '&::-webkit-scrollbar': {
            width: { xs: '4px', sm: '6px', md: '8px' },
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
        {recentSearches.map((search, index) => (
          <Button
            key={`${search.name}-${search.timestamp}-${index}`}
            onClick={() => handleClick(search)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: { xs: '12px 16px', sm: '14px 20px', md: '16px 24px' },
              borderRadius: '9999px',
              background: 'rgba(102, 126, 234, 0.15)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'none',
              transition: 'all 200ms ease',
              '&:hover': {
                transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                backgroundColor: 'rgba(102, 126, 234, 0.25)',
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
            }}
          >
            {search.name}
            {search.country && `, ${search.country}`}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

// Hook per salvare le ricerche (da usare nel componente padre)
export const useSaveRecentSearch = () => {
  const saveSearch = (location) => {
    const saved = localStorage.getItem('recentSearches');
    let recentSearches = [];
    
    if (saved) {
      try {
        recentSearches = JSON.parse(saved);
      } catch (error) {
        console.error('Errore nel caricamento delle ricerche:', error);
      }
    }

    const searchItem = {
      name: location.name,
      country: location.country || '',
      latitude: location.latitude,
      longitude: location.longitude,
      admin1: location.admin1 || null,
      timestamp: Date.now(),
    };

    // Rimuovi duplicati (stessa città)
    const filtered = recentSearches.filter(
      (item) => item.name.toLowerCase() !== location.name.toLowerCase()
    );
    
    // Aggiungi la nuova ricerca all'inizio
    const updated = [searchItem, ...filtered].slice(0, 8); // Massimo 8 ricerche
    
    // Salva nel localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Dispatches un evento custom per notificare l'aggiornamento
    window.dispatchEvent(new Event('recentSearchesUpdated'));
  };

  return { saveSearch };
};
