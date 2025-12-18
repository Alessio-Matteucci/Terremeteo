/**
 * Servizio per ottenere i dati meteorologici
 * Utilizza l'API Open-Meteo
 */

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Ottiene i dati meteorologici per una località specifica
 * @param {number} latitude - Latitudine
 * @param {number} longitude - Longitudine
 * @returns {Promise<Object|null>} Dati meteorologici o null in caso di errore
 */
export const getWeatherData = async (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
    );

    if (!response.ok) {
      throw new Error('Errore nella richiesta meteo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore nel recupero dati meteo:', error);
    return null;
  }
};

/**
 * Converte il codice meteo in descrizione testuale
 * @param {number} code - Codice meteo
 * @returns {string} Descrizione del tempo
 */
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: 'Sereno',
    1: 'Prevalentemente sereno',
    2: 'Parzialmente nuvoloso',
    3: 'Coperto',
    45: 'Nebbia',
    48: 'Nebbia ghiacciata',
    51: 'Pioggia leggera',
    53: 'Pioggia moderata',
    55: 'Pioggia intensa',
    56: 'Pioggia gelata leggera',
    57: 'Pioggia gelata intensa',
    61: 'Pioggia leggera',
    63: 'Pioggia moderata',
    65: 'Pioggia intensa',
    66: 'Pioggia gelata leggera',
    67: 'Pioggia gelata intensa',
    71: 'Neve leggera',
    73: 'Neve moderata',
    75: 'Neve intensa',
    77: 'Granelli di neve',
    80: 'Rovesci leggeri',
    81: 'Rovesci moderati',
    82: 'Rovesci intensi',
    85: 'Rovesci di neve leggeri',
    86: 'Rovesci di neve intensi',
    95: 'Temporale',
    96: 'Temporale con grandine leggera',
    99: 'Temporale con grandine intensa',
  };

  return weatherCodes[code] || 'Sconosciuto';
};

/**
 * Ottiene l'icona meteo basata sul codice
 * @param {number} code - Codice meteo
 * @returns {string} Emoji o simbolo rappresentativo
 */
export const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌤️';
};

