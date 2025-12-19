import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Componente del globo terrestre 3D realistico
 * Si anima per posizionarsi sulle coordinate specificate
 */
function Globe({ targetLat, targetLon, isAnimating, onPickLocation }) {
  const globeGroupRef = useRef();
  const globeRef = useRef();
  const controlsRef = useRef();
  const cloudsRef = useRef();
  const desiredTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCameraPosRef = useRef(new THREE.Vector3(0, 0, 5));
  const desiredDistanceRef = useRef(5);
  
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
    } else {
      // Reset quando non c'è target
      desiredDistanceRef.current = 5;
      desiredTargetRef.current.set(0, 0, 0);
      desiredCameraPosRef.current.set(0, 0, 5);
    }
  }, [targetLat, targetLon]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    // Se non stiamo animando, non “forziamo” la camera: lasciamo l'utente libero di ruotare/zoomare.
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
          <LocationMarker lat={targetLat} lon={targetLon} latLonToVector3={latLonToVector3} />
        )}
      </group>

      {/* Illuminazione: globo SEMPRE illuminato (no lato notte) */}
      <ambientLight intensity={1.2} />
      <hemisphereLight intensity={0.9} color="#ffffff" groundColor="#ffffff" />
    </>
  );
}

/**
 * Marker per indicare la posizione sulla mappa
 */
function LocationMarker({ lat, lon, latLonToVector3 }) {
  const markerRef = useRef();
  const pulseRef = useRef();

  useEffect(() => {
    if (!markerRef.current) return;

    // Posiziona il marker esattamente sulla superficie del globo (raggio 2)
    const pos = latLonToVector3(lat, lon, 2.0);
    markerRef.current.position.copy(pos);

    // Orienta il marker verso l'esterno: allinea l'asse +Z locale alla normale
    const normal = pos.clone().normalize();
    markerRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [lat, lon, latLonToVector3]);

  // Animazione pulsante
  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    // Riduce la dimensione complessiva del marker (sfera + anello + cono)
    <group ref={markerRef} scale={0.15}>
      {/* Marker principale - posizionato leggermente sopra la superficie */}
      <mesh position={[0, 0, 0.01]}>
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
 * Componente principale del globo 3D
 */
export default function Globe3D({ targetLat, targetLon, isAnimating, onPickLocation }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
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
        />
      </Canvas>
    </div>
  );
}
