# TerreMeteo

Un'applicazione web moderna e interattiva per esplorare il meteo di qualsiasi località del mondo attraverso un globo terrestre 3D interattivo.

## Caratteristiche

- **Globo Terrestre 3D Interattivo**: Naviga un globo terrestre realistico con texture ad alta risoluzione, nuvole animate e atmosfera
- **Ricerca Città**: Cerca qualsiasi città nel mondo con autocompletamento intelligente
- **Dati Meteorologici in Tempo Reale**: Visualizza condizioni meteo attuali e previsioni a 7 giorni
- **Selezione Interattiva**: Clicca direttamente sul globo per selezionare una località
- **Luoghi Popolari**: Accesso rapido alle città più cercate
- **Popup Informativo**: Visualizza informazioni meteo direttamente sul globo
- **Design Responsive**: Interfaccia ottimizzata per desktop, tablet e mobile
- **Tema Scuro Moderno**: Design elegante con effetti blur e colori coerenti

## Tecnologie Utilizzate

- **React 19.2.0** - Libreria UI
- **React Router DOM 7.11.0** - Routing
- **Material-UI (MUI) 7.3.6** - Componenti UI
- **Three.js 0.182.0** - Grafica 3D
- **@react-three/fiber 9.4.2** - React renderer per Three.js
- **@react-three/drei 10.7.7** - Helpers per Three.js
- **Vite 7.2.4** - Build tool e dev server

## Installazione

### Prerequisiti
- Node.js (versione 18 o superiore)
- npm o yarn

### Setup

1. Clona il repository
```bash
git clone https://github.com/tuonome/terremeteo.git
cd terremeteo/TerreMeteo
```

2. Installa le dipendenze
```bash
npm install
```

3. Avvia il server di sviluppo
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
npm run build
```

Il build sarà disponibile nella cartella `dist/`

## Funzionalità Principali

### Globo Terrestre 3D
Navigazione interattiva con rotazione, zoom e doppio click per selezionare posizioni. Visualizzazione realistica con texture ad alta risoluzione, nuvole animate, effetto atmosfera e stelle di sfondo. La camera si sposta automaticamente verso la località selezionata con zoom automatico.

### Barra di Ricerca
Autocompletamento intelligente con ricerca debounced (300ms), suggerimenti in tempo reale e supporto per nomi di città in italiano. Ricerca con Enter o click, chiusura automatica dopo selezione.

### Dati Meteorologici
Informazioni attuali: temperatura corrente, condizioni meteo, umidità relativa, velocità e direzione del vento. Previsioni a 7 giorni con temperature minime e massime, visualizzate in card responsive.

### Popup Informativo
Posizionamento intelligente (centrato su mobile, accanto al marker su desktop) con informazioni geografiche, dati meteo attuali e previsioni per i prossimi 3 giorni.

### Luoghi Popolari
Accesso rapido a 8 città predefinite (Roma, Milano, Parigi, Londra, New York, Tokyo, Sydney, Dubai) con layout responsive.

## Struttura del Progetto

```
TerreMeteo/
├── src/
│   ├── Components/          # Componenti React
│   ├── Pages/               # Pagine dell'app
│   ├── ErrorPages/          # Pagine di errore
│   ├── services/            # Servizi API
│   ├── hooks/               # Custom React Hooks
│   └── assets/              # Risorse statiche
├── package.json
└── vite.config.js
```

## API Utilizzate

### Open-Meteo Geocoding API
Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
Funzione: Conversione nomi di città in coordinate geografiche

### Open-Meteo Weather API
Endpoint: `https://api.open-meteo.com/v1/forecast`
Funzione: Dati meteorologici in tempo reale e previsioni a 7 giorni

Entrambe le API sono gratuite e non richiedono autenticazione.

## Tema e Design

**Palette Colori:**
- Primario: `#667eea` (Blu-viola)
- Secondario: `#764ba2` (Viola)
- Sfondo: `#0a0a0a` (Nero)
- Paper: `rgba(26, 26, 46, 0.6)` (Blu scuro trasparente)

Tema scuro con effetti glassmorphism, transizioni smooth, ombre e blur effects.

## Scripts Disponibili

```bash
npm run dev      # Avvia il server di sviluppo
npm run build    # Crea il build di produzione
npm run preview  # Anteprima del build di produzione
npm run lint     # Esegue il linter
```

## Compatibilità

- Chrome/Edge (ultime versioni)
- Firefox (ultime versioni)
- Safari (ultime versioni)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Funzionalità Future

- Salvataggio località preferite
- Confronto meteo tra più città
- Grafici meteo interattivi
- Notifiche meteo
- Storia ricerche recenti
- Modalità giorno/notte per il globo
- Esportazione dati meteo

## Licenza

Questo progetto è stato sviluppato a scopo educativo.

## Autori

- **Borozan** - Sviluppo componenti principali e UI
- **Matteucci** - Integrazione API, routing e funzionalità avanzate
