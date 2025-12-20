# Terremeteo
18-12-2025
Borozan: Aggiunta dei components principali per il funzionamento del programma (la Parte grafica è da rimodellare) 
tutte le aggiunte sono state fatte nella cartella components

inoltre aggiunta cartella Pages per la gestione succesiva delle diverse paggine 

Aggiunta:{

    Globo3D.jsx 
    Logo.jsx
    CaricamentoAPI.jsx
    LuoghiPopolari.jsx
    SearchBar.jsx
    PannelloMeteo.jsx
} 

Matteucci: aggiunta di tutta la parte inerente alla chiamata delle api con qualche correzione del codice presente nel file:
logo.jsx, con aggiornamento del file luoghipopolari.jsx per risolvere un errore di caricamento 
aggiunta:{
    NotFoundPage.jsx
    ExplorePage.jsx
    WeatherService.js
    GeocodingService.js
}
i due file Service contengono le due api che siamo andati ad utilizzare il geocoding e le informazioni meteo .
modifica di componenti principali per andare a far visualizzare tutti i components con utilizzo di react router per gestire le due rotte principali e tramite * tutte le altre rotte che portano alla pagina not found
modifiche:{
    app.jsx
    app.css 
    index.css
    SearchBar.jsx 
}

Borozan: Prima aggiunta del robot.txt per mestrare le rotte disponibbili dagli user e modifica alla parte css per migliorare diversi elementi estetici ,

Aggiunta Elements{

    MediaPages.jsx
}

