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

19/12/2025

Borozan: Prima aggiunta del robot.txt per mestrare le rotte disponibbili dagli user e modifica alla parte css per migliorare diversi elementi estetici ,

Aggiunta Elements{

    MediaPages.jsx
}

Matteucci: Modifica del gitignore, modifiche importanti al marker della mappa con le sue diverse interazioni, file interessati:{
    caricamentoAPI.jsx
    globo3d.jsx 
    LuoghiPopolari.jsx
    SearchBar.jsx
    PannelloMeteo.jsx
    ExplorePage.jsx
}

20/12/2025

Matteucci: Implementazione del popup informativo accanto al marker e miglioramenti alla barra di ricerca:
- Aggiunto popup con informazioni meteo che appare automaticamente quando viene cercata una posizione
- Aggiunto bottone "Cerca" nella barra di ricerca con icona
- Barra di ricerca si chiude automaticamente quando viene eseguita una ricerca (clic bottone o Enter)
- Gestione del click fuori dalla barra di ricerca per chiudere i risultati
- Popup non si riapre automaticamente se è stato chiuso manualmente con la X

File modificati:{
    Globo3D.jsx (aggiunto MarkerInfoPopup, gestione posizionamento popup, reset camera)
    SearchBar.jsx (aggiunto bottone cerca, gestione chiusura automatica)
    ExplorePage.jsx (gestione reset visuale, posizionamento barra di ricerca)
}

21/12/2025

Borozan: implementazione funzionale per la cronologia delle ricerche, aggiunta di un footer nelle pagine e fix generale della posizione degli elementi dell app

implementazione degli elements:{

    Footer.jsx
    LogoTerraMeteo
    UltimeRicerche
} 