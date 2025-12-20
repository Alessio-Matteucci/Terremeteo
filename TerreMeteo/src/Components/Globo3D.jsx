import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Typography, Paper, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherService';

/**
 * Componente del globo terrestre 3D realistico
 * Si anima per posizionarsi sulle coordinate specificate
 */
function Globe({ targetLat, targetLon, isAnimating, onPickLocation, weatherData, locationData, onMarkerClick, markerRef, shouldResetCamera }) {
  const globeGroupRef = useRef();
  const globeRef = useRef();
  const controlsRef = useRef();
  const cloudsRef = useRef();
  const desiredTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCameraPosRef = useRef(new THREE.Vector3(0, 0, 5));
  const desiredDistanceRef = useRef(5);
  const isResettingRef = useRef(false);
  
  // Carica le texture della Terra e delle nuvole
  // Usiamo texture pubbliche ad alta risoluzione da Three.js examples
  const [earthTexture, normalMap, cloudsTexture] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  ]);

  // Configura le texture
  useEffect(() => {
    if (earthTexture) {
      earthTexture.wrapS = earthTexture.wrapT = THREE.RepeatWrapping;
    }
    if (cloudsTexture) {
      cloudsTexture.wrapS = cloudsTexture.wrapT = THREE.RepeatWrapping;
    }
  }, [earthTexture, cloudsTexture]);

  /**
   * Conversione LAT/LON -> vettore 3D **coerente con SphereGeometry** (Three.js).
   * SphereGeometry genera i vertici così:
   *   x = -r cos(phi) sin(theta)
   *   y =  r cos(theta)
   *   z =  r sin(phi) sin(theta)
   * dove:
   *  - phi  = (lon + 180) in radianti (u = 0..1)
   *  - theta = (90 - lat) in radianti (v = 0..1)
   *
   * In pratica: Greenwich (lon=0) cade su +X (come nella texture standard).
   */
  const latLonToVector3 = (lat, lon, radius) => {
    const phi = THREE.MathUtils.degToRad(lon + 180);
    const theta = THREE.MathUtils.degToRad(90 - lat);

    const x = -radius * Math.cos(phi) * Math.sin(theta);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  };

  /**
   * Conversione vettore 3D (locale) -> LAT/LON coerente con latLonToVector3 (SphereGeometry).
   */
  const vector3ToLatLon = (vec) => {
    const r = vec.length();
    if (!r) return { lat: 0, lon: 0 };

    // Clamp numerico per sicurezza
    const y = THREE.MathUtils.clamp(vec.y / r, -1, 1);
    const theta = Math.acos(y); // 0..PI
    const lat = 90 - THREE.MathUtils.radToDeg(theta);

    // Inverso di:
    // x = -r cos(phi) sin(theta)
    // z =  r sin(phi) sin(theta)
    const phi = Math.atan2(vec.z, -vec.x); // -PI..PI (equivalente a 0..2PI)
    let lon = THREE.MathUtils.radToDeg(phi) - 180;

    // Normalizza a [-180, 180]
    lon = ((lon + 180) % 360 + 360) % 360 - 180;

    return { lat, lon };
  };

  const handleEarthDoubleClick = (e) => {
    e.stopPropagation();
    if (!onPickLocation || !globeRef.current) return;

    // Convertiamo il punto d'intersezione in coordinate locali della mesh Terra,
    // così la conversione lat/lon resta corretta anche se in futuro ruotiamo il gruppo.
    const localPoint = globeRef.current.worldToLocal(e.point.clone());
    const { lat, lon } = vector3ToLatLon(localPoint);
    onPickLocation(lat, lon);
  };

  useEffect(() => {
    if (targetLat !== null && targetLon !== null) {
      // Terra fissa: NON ruotiamo il globo.
      // Centriamo e facciamo zoom muovendo la camera verso la località selezionata.
      const targetPos = latLonToVector3(targetLat, targetLon, 2); // superficie globo
      const normal = targetPos.clone().normalize();

      // Distanza camera: più piccola => zoom maggiore
      // Valori consigliati: 0.25 (molto vicino) -> 3.5 (più lontano)
      desiredDistanceRef.current = 0.55;
      desiredTargetRef.current.copy(targetPos);
      // Clamp di sicurezza per evitare casi estremi
      const distance = THREE.MathUtils.clamp(desiredDistanceRef.current, 0.2, 6);
      desiredCameraPosRef.current.copy(targetPos).add(normal.multiplyScalar(distance));
      isResettingRef.current = false;
    } else {
      // Reset quando non c'è target
      desiredDistanceRef.current = 5;
      desiredTargetRef.current.set(0, 0, 0);
      desiredCameraPosRef.current.set(0, 0, 5);
    }
  }, [targetLat, targetLon]);

  // Reset forzato della camera quando viene richiesto
  useEffect(() => {
    if (shouldResetCamera && targetLat === null && targetLon === null) {
      isResettingRef.current = true;
      desiredDistanceRef.current = 5;
      desiredTargetRef.current.set(0, 0, 0);
      desiredCameraPosRef.current.set(0, 0, 5);
    }
  }, [shouldResetCamera, targetLat, targetLon]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    // Se stiamo resettando la camera, forziamo l'animazione anche se isAnimating è false
    if (isResettingRef.current) {
      const t = 0.08;
      state.camera.position.lerp(desiredCameraPosRef.current, t);
      controlsRef.current.target.lerp(desiredTargetRef.current, t);
      controlsRef.current.update();
      
      // Controlla se abbiamo raggiunto la posizione desiderata
      const distance = state.camera.position.distanceTo(desiredCameraPosRef.current);
      const targetDistance = controlsRef.current.target.distanceTo(desiredTargetRef.current);
      if (distance < 0.01 && targetDistance < 0.01) {
        isResettingRef.current = false;
      }
      return;
    }

    // Se non stiamo animando, non "forziamo" la camera: lasciamo l'utente libero di ruotare/zoomare.
    // Il set iniziale viene comunque fatto nel momento della ricerca.
    if (!isAnimating) return;

    const t = 0.08;
    state.camera.position.lerp(desiredCameraPosRef.current, t);
    controlsRef.current.target.lerp(desiredTargetRef.current, t);
    controlsRef.current.update();
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={0.2}
        maxDistance={8}
        autoRotate={false}
        zoomSpeed={0.8}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
      />
      <Stars radius={300} depth={60} count={10000} factor={7} fade speed={1} />

      {/* Gruppo unico: ruotiamo questo (terra + nuvole + marker + atmosfera) */}
      <group ref={globeGroupRef}>
        {/* Globo terrestre con texture */}
        <mesh ref={globeRef} onDoubleClick={handleEarthDoubleClick}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.5, 0.5)}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Layer delle nuvole */}
        <mesh ref={cloudsRef} raycast={() => null}>
          <sphereGeometry args={[2.01, 64, 64]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>

        {/* Atmosfera (glow effect) */}
        <mesh raycast={() => null}>
          <sphereGeometry args={[2.05, 32, 32]} />
          <meshBasicMaterial
            color="#667eea"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Marker per la posizione selezionata */}
        {targetLat !== null && targetLon !== null && (
          <LocationMarker 
            lat={targetLat} 
            lon={targetLon} 
            latLonToVector3={latLonToVector3}
            onMarkerClick={onMarkerClick}
            markerRef={markerRef}
          />
        )}
      </group>

      {/* Illuminazione: globo SEMPRE illuminato (no lato notte) */}
      <ambientLight intensity={1.2} />
      <hemisphereLight intensity={0.9} color="#ffffff" groundColor="#ffffff" />
    </>
  );
}

/**
 * Popup per visualizzare le informazioni meteo accanto al marker
 */
function MarkerInfoPopup({ weatherData, locationData, onClose }) {
  if (!weatherData || !locationData) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;

  const formatCoord = (value, posLabel, negLabel) => {
    const n = Number(value);
    const label = n >= 0 ? posLabel : negLabel;
    return `${Math.abs(n).toFixed(4)}°${label}`;
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 200,
        maxWidth: 250,
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        position: 'relative',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pulsante di chiusura */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '4px',
          '&:hover': {
            color: 'white',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
          },
          zIndex: 10,
        }}
        size="small"
      >
        <CloseIcon sx={{ fontSize: '16px' }} />
      </IconButton>

      {/* Informazioni geografiche */}
      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 'bold', pr: 3, fontSize: '0.875rem' }}>
        {locationData.name}
        {locationData.admin1 && `, ${locationData.admin1}`}
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block', fontSize: '0.7rem' }}>
        {locationData.country || '—'} • {formatCoord(locationData.latitude, 'N', 'S')},{' '}
        {formatCoord(locationData.longitude, 'E', 'W')}
      </Typography>

      {/* Dati meteo attuali */}
      {current && (
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1.2 }}>
                {current.temperature_2m.toFixed(1)}°C
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
                {getWeatherDescription(current.weather_code)}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>
              {getWeatherIcon(current.weather_code)}
            </Typography>
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem' }}>
                  Umidità
                </Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.75rem', display: 'block' }}>
                  {current.relative_humidity_2m}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem' }}>
                  Vento
                </Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.75rem', display: 'block' }}>
                  {current.wind_speed_10m.toFixed(1)} km/h
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem' }}>
                Ora: {new Date(current.time).toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Previsioni giornaliere (prime 3) */}
      {daily && daily.time && daily.time.length > 0 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(102, 126, 234, 0.2)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.75, display: 'block', fontSize: '0.7rem' }}>
            Prossimi 3 giorni
          </Typography>
          <Grid container spacing={0.5}>
            {daily.time.slice(0, 3).map((date, index) => (
              <Grid item xs={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', fontSize: '0.65rem' }}>
                    {new Date(date).toLocaleDateString('it-IT', {
                      weekday: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                  <Typography sx={{ color: 'white', my: 0.25, fontSize: '1.25rem', lineHeight: 1 }}>
                    {getWeatherIcon(daily.weather_code[index])}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.7rem' }}>
                    {daily.temperature_2m_max[index].toFixed(0)}°
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', fontSize: '0.65rem' }}>
                    {daily.temperature_2m_min[index].toFixed(0)}°
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
}

/**
 * Marker per indicare la posizione sulla mappa
 */
function LocationMarker({ lat, lon, latLonToVector3, onMarkerClick, markerRef: externalMarkerRef }) {
  const internalMarkerRef = useRef();
  const markerRef = externalMarkerRef || internalMarkerRef;
  const pulseRef = useRef();
  const { camera, gl } = useThree();
  
  // Esponi il ref al componente padre
  useEffect(() => {
    if (externalMarkerRef) {
      if (internalMarkerRef.current) {
        externalMarkerRef.current = internalMarkerRef.current;
      }
    }
  }, [externalMarkerRef]);

  useEffect(() => {
    if (!internalMarkerRef.current) return;

    // Posiziona il marker esattamente sulla superficie del globo (raggio 2)
    const pos = latLonToVector3(lat, lon, 2.0);
    internalMarkerRef.current.position.copy(pos);

    // Orienta il marker verso l'esterno: allinea l'asse +Z locale alla normale
    const normal = pos.clone().normalize();
    internalMarkerRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [lat, lon, latLonToVector3]);

  // Animazione pulsante
  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  const handleMarkerClick = (e) => {
    e.stopPropagation();
    if (onMarkerClick && internalMarkerRef.current) {
      // Calcola la posizione del marker nello schermo
      const worldPos = new THREE.Vector3();
      internalMarkerRef.current.getWorldPosition(worldPos);
      const screenPos = worldPos.project(camera);
      
      // Converti in coordinate pixel
      const widthHalf = gl.domElement.clientWidth / 2;
      const heightHalf = gl.domElement.clientHeight / 2;
      const x = (screenPos.x * widthHalf) + widthHalf;
      const y = -(screenPos.y * heightHalf) + heightHalf;
      
      // Ottieni il bounding box del canvas
      const rect = gl.domElement.getBoundingClientRect();
      
      onMarkerClick({
        x: rect.left + x,
        y: rect.top + y,
      });
    }
  };

  return (
    // Riduce la dimensione complessiva del marker (sfera + anello + cono)
    <group ref={internalMarkerRef} scale={0.15}>
      {/* Marker principale - posizionato leggermente sopra la superficie */}
      <mesh 
        position={[0, 0, 0.01]}
        onClick={handleMarkerClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color="#667eea" 
          emissive="#667eea" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Anello pulsante */}
      <mesh ref={pulseRef} position={[0, 0, 0.01]}>
        <torusGeometry args={[0.08, 0.01, 16, 32]} />
        <meshStandardMaterial 
          color="#764ba2" 
          emissive="#764ba2" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Raggio di luce che punta verso l'esterno */}
      <mesh position={[0, 0, 0.09]}>
        <coneGeometry args={[0.02, 0.12, 8]} />
        <meshStandardMaterial 
          color="#667eea" 
          emissive="#667eea" 
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Componente helper per aggiornare la posizione del popup
 */
function PopupPositionUpdater({ markerRef, onPositionUpdate, enabled }) {
  const { camera, gl } = useThree();

  useFrame(() => {
    if (!enabled || !markerRef.current) return;

    const worldPos = new THREE.Vector3();
    markerRef.current.getWorldPosition(worldPos);
    const screenPos = worldPos.project(camera);
    
    // Controlla se il marker è visibile (z tra -1 e 1)
    if (screenPos.z > 1 || screenPos.z < -1) return;
    
    // Converti in coordinate pixel
    const widthHalf = gl.domElement.clientWidth / 2;
    const heightHalf = gl.domElement.clientHeight / 2;
    const x = (screenPos.x * widthHalf) + widthHalf;
    const y = -(screenPos.y * heightHalf) + heightHalf;
    
    // Ottieni il bounding box del canvas
    const rect = gl.domElement.getBoundingClientRect();
    
    onPositionUpdate({
      x: rect.left + x,
      y: rect.top + y,
    });
  });

  return null;
}

/**
 * Componente principale del globo 3D
 */
export default function Globe3D({ targetLat, targetLon, isAnimating, onPickLocation, weatherData, locationData, onResetView }) {
  const [popupPosition, setPopupPosition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [manuallyClosed, setManuallyClosed] = useState(false);
  const [shouldResetCamera, setShouldResetCamera] = useState(false);
  const markerRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const handleMarkerClick = (screenPosition) => {
    if (weatherData && locationData) {
      setPopupPosition(screenPosition);
      setShowPopup(true);
      setManuallyClosed(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupPosition(null);
    setManuallyClosed(true);
    // Attiva il reset della camera
    setShouldResetCamera(true);
    // Resetta la visuale del globo quando il popup viene chiuso
    if (onResetView) {
      onResetView();
    }
    // Resetta il flag dopo un breve delay per permettere al reset di essere processato
    setTimeout(() => {
      setShouldResetCamera(false);
    }, 100);
  };

  const handlePositionUpdate = (position) => {
    if (showPopup) {
      setPopupPosition(position);
    } else if (weatherData && locationData && position && !manuallyClosed) {
      // Apri automaticamente il popup quando i dati sono pronti, solo se non è stato chiuso manualmente
      setPopupPosition(position);
      setShowPopup(true);
    }
  };

  // Chiudi il popup quando cambiano le coordinate e resetta il flag di chiusura manuale
  useEffect(() => {
    setShowPopup(false);
    setPopupPosition(null);
    setManuallyClosed(false);
  }, [targetLat, targetLon]);

  // Apri automaticamente il popup quando i dati meteo sono disponibili
  useEffect(() => {
    if (weatherData && locationData && targetLat !== null && targetLon !== null) {
      // Il popup verrà aperto automaticamente quando PopupPositionUpdater calcola la posizione
      // Attiviamo l'updater anche quando non è ancora visibile per calcolare la posizione iniziale
    }
  }, [weatherData, locationData, targetLat, targetLon]);

  return (
    <div ref={canvasContainerRef} style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #000 100%)' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Globe
          targetLat={targetLat}
          targetLon={targetLon}
          isAnimating={isAnimating}
          onPickLocation={onPickLocation}
          weatherData={weatherData}
          locationData={locationData}
          onMarkerClick={handleMarkerClick}
          markerRef={markerRef}
          shouldResetCamera={shouldResetCamera}
        />
        {/* Aggiorna sempre la posizione quando ci sono dati meteo, anche se il popup non è ancora visibile */}
        {weatherData && locationData && targetLat !== null && targetLon !== null && (
          <PopupPositionUpdater
            markerRef={markerRef}
            onPositionUpdate={handlePositionUpdate}
            enabled={true}
          />
        )}
      </Canvas>
      
      {/* Popup overlay sopra la mappa - posizionato a destra del marker */}
      {showPopup && popupPosition && weatherData && locationData && (
        <Box
          sx={{
            position: 'fixed',
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            transform: 'translate(20px, -50%)',
            zIndex: 1000,
            pointerEvents: 'auto',
          }}
        >
          <MarkerInfoPopup
            weatherData={weatherData}
            locationData={locationData}
            onClose={handleClosePopup}
          />
        </Box>
      )}
    </div>
  );
}
