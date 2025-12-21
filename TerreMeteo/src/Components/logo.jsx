import logoImage from '../assets/logo_TerreMeteo.png';

function Logo() {
  return (
    <div
      style={{
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img 
        src={logoImage} 
        alt="TerreMeteo Logo"
        style={{ 
          height: '80px', 
          width: 'auto', 
          objectFit: 'contain',
          maxWidth: '300px',
        }}
      />
    </div>
  );
}

export default Logo;