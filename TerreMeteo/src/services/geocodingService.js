/**
 * Servizio per il geocoding - conversione di nomi di città in coordinate
 * Utilizza l'API Open-Meteo Geocoding
 */

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Cerca una città e restituisce le coordinate
 * @param {string} cityName - Nome della città da cercare
 * @returns {Promise<Array>} Array di risultati con coordinate e informazioni
 */
export const searchCity = async (cityName) => {
  if (!cityName || cityName.trim() === '') {
    return [];
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?name=${encodeURIComponent(cityName)}&count=10&language=it&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Errore nella richiesta di geocoding');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Errore nel geocoding:', error);
    return [];
  }
};

/**
 * Ottiene le coordinate di una città specifica
 * @param {string} cityName - Nome della città
 * @returns {Promise<Object|null>} Oggetto con lat, lon e nome, o null se non trovato
 */
export const getCityCoordinates = async (cityName) => {
  const results = await searchCity(cityName);
  
  if (results.length > 0) {
    return {
      latitude: results[0].latitude,
      longitude: results[0].longitude,
      name: results[0].name,
      country: results[0].country,
      admin1: results[0].admin1, // Regione/Stato
    };
  }
  
  return null;
};

