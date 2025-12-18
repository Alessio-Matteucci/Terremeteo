import logoImage from '../assets/logo.png';

function Logo() {
  return (
    <>
      <img 
        src={logoImage} 
        alt="TerreMeteo Logo"
        style={{ maxWidth: '200px', height: 'auto' }}
      />
    </>
  );
}

export default Logo;