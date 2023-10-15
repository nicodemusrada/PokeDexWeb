import '../assets/css/header.css';
import logo from '../assets/logo.png';
import { useState } from 'react';

export function Header() {
  const [logoLoaded, setLogoLoaded] = useState(true);
  const handleLogoLoadError = () => {
    setLogoLoaded(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        {!logoLoaded && <h1 className="logo-fallback">Pokedex</h1>}
        <img src={logo} alt="PokeDex" className="logo" onError={handleLogoLoadError} />
      </div>
    </header>
  );
}