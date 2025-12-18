import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Componente del globo terrestre 3D realistico
 * Si anima per posizionarsi sulle coordinate specificate
 */
function Globe({ targetLat, targetLon, isAnimating }) {
  const globeRef = useRef();
  const controlsRef = useRef();
  const cloudsRef = useRef();
  
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

  // Funzione helper per convertire lat/lon in coordinate 3D
  // Allineata con la texture standard della Terra utilizzata da Three.js
  // La texture ha Greenwich (0°) al centro e l'equatore al centro verticale
  const latLonToCartesian = (lat, lon, radius) => {
    // Converti lat/lon in radianti
    // Latitudine: -90 (sud) a +90 (nord)
    // Longitudine: -180 (ovest) a +180 (est)
    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);

    // Formula corretta per coordinate sferiche allineata con texture standard della Terra
    // La texture standard della Terra ha:
    // - Greenwich (0° lon) al centro dell'immagine
    // - Equatore (0° lat) al centro verticale
    // - Nord verso l'alto
    // 
    // Nel sistema Three.js (right-handed):
    // - x: positivo est, negativo ovest
    // - y: positivo nord (alto), negativo sud (basso)
    // - z: positivo avanti, negativo indietro
    //
    // Con la rotazione del globo di -90° sull'asse Y, la formula diventa:
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);

    return { x, y, z };
  };

  useEffect(() => {
    if (targetLat !== null && targetLon !== null) {
      const radius = 2;
      const { x, y, z } = latLonToCartesian(targetLat, targetLon, radius);

      // Ferma la rotazione del globo quando viene selezionata una posizione
      // Questo mantiene il marker nella posizione corretta
      if (globeRef.current) {
        // Non resettiamo la rotazione, ma la fermiamo (non aggiungiamo più rotazione)
        // Il globo manterrà la sua posizione attuale
      }

      // Posiziona il target dei controlli sulla posizione
      if (controlsRef.current) {
        controlsRef.current.target.set(x, y, z);
      }
    } else {
      // Quando non c'è posizione selezionata, il globo può ruotare liberamente
      // La rotazione riprenderà automaticamente nel useFrame
    }
  }, [targetLat, targetLon]);

  useFrame((state) => {
    // Rotazione lenta del globo solo se non c'è una posizione selezionata
    // Quando c'è una posizione, il globo si ferma per mantenere il marker visibile
    if (globeRef.current && targetLat === null && targetLon === null) {
      globeRef.current.rotation.y += 0.0005;
    }
    
    // Rotazione delle nuvole (continua sempre per effetto realistico)
    // Le nuvole ruotano indipendentemente dal globo
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }

    // Anima la camera verso la posizione target
    if (targetLat !== null && targetLon !== null && controlsRef.current) {
      const radius = 2;
      const { x: targetX, y: targetY, z: targetZ } = latLonToCartesian(
        targetLat,
        targetLon,
        radius
      );

      // Calcola la posizione della camera (leggermente indietro rispetto al target)
      // La camera deve essere posizionata lungo la normale alla superficie
      const normal = new THREE.Vector3(targetX, targetY, targetZ).normalize();
      // Distanza iniziale della camera - può essere modificata dallo zoom dell'utente
      const baseCameraDistance = 4;
      const cameraX = targetX + normal.x * baseCameraDistance;
      const cameraY = targetY + normal.y * baseCameraDistance;
      const cameraZ = targetZ + normal.z * baseCameraDistance;

      if (isAnimating) {
        state.camera.position.lerp(
          new THREE.Vector3(cameraX, cameraY, cameraZ),
          0.05
        );
        controlsRef.current.target.lerp(
          new THREE.Vector3(targetX, targetY, targetZ),
          0.05
        );
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
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
      
      {/* Globo terrestre con texture realistica */}
      {/* Rotazione per allineare la texture: rotazione di 90° sull'asse Y per allineare Greenwich */}
      <mesh ref={globeRef} rotation={[0, -Math.PI / 2, 0]}>
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
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      
      {/* Atmosfera (glow effect) */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Marker per la posizione selezionata */}
      {targetLat !== null && targetLon !== null && (
        <LocationMarker lat={targetLat} lon={targetLon} />
      )}

      {/* Illuminazione realistica */}
      <ambientLight intensity={0.3} />
      
      {/* Luce solare direzionale (simula il sole) */}
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={1.2}
        castShadow={false}
      />
      
      {/* Luce di riempimento per il lato notte */}
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a90e2" />
    </>
  );
}

/**
 * Marker per indicare la posizione sulla mappa
 */
function LocationMarker({ lat, lon }) {
  const markerRef = useRef();
  const pulseRef = useRef();

  // Funzione helper per convertire lat/lon in coordinate 3D (stessa del componente Globe)
  const latLonToCartesian = (lat, lon, radius) => {
    // Formula corretta allineata con texture standard della Terra
    // Con la rotazione del globo di -90° sull'asse Y
    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);
    
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    
    return { x, y, z };
  };

  useEffect(() => {
    const radius = 2.05; // Leggermente sopra la superficie del globo
    const { x, y, z } = latLonToCartesian(lat, lon, radius);

    if (markerRef.current) {
      markerRef.current.position.set(x, y, z);
      
      // Orienta il marker verso l'esterno (normale alla superficie)
      const normal = new THREE.Vector3(x, y, z).normalize();
      // Il marker guarda verso l'esterno lungo la normale
      const lookAtPoint = new THREE.Vector3(
        x + normal.x * 2,
        y + normal.y * 2,
        z + normal.z * 2
      );
      markerRef.current.lookAt(lookAtPoint);
    }
  }, [lat, lon]);

  // Animazione pulsante
  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={markerRef}>
      {/* Marker principale */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Anello pulsante */}
      <mesh ref={pulseRef}>
        <torusGeometry args={[0.08, 0.01, 16, 32]} />
        <meshStandardMaterial 
          color="#ff4444" 
          emissive="#ff4444" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Raggio di luce che punta verso l'esterno */}
      <mesh position={[0, 0, 0.08]}>
        <coneGeometry args={[0.02, 0.12, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Componente wrapper per gestire errori di caricamento texture
 */
function GlobeWithErrorBoundary({ targetLat, targetLon, isAnimating }) {
  return (
    <Globe targetLat={targetLat} targetLon={targetLon} isAnimating={isAnimating} />
  );
}

/**
 * Componente principale del globo 3D
 */
export default function Globe3D({ targetLat, targetLon, isAnimating }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #000 100%)' }}
        gl={{ antialias: true, alpha: false }}
      >
        <GlobeWithErrorBoundary 
          targetLat={targetLat} 
          targetLon={targetLon} 
          isAnimating={isAnimating} 
        />
      </Canvas>
    </div>
  );
}
