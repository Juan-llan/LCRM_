// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ruta al archivo del logo
import './navbar.css';

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem('session'); // o usar contexto

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" /> {/* Añadido el logo aquí */}
      </div>
      <div className="nav-buttons">
        {!isAuthenticated && <Link to="/login">Iniciar Sesión</Link>}
        {!isAuthenticated && <Link to="/register">Registrarse</Link>}
        {isAuthenticated && <button className="logout">Cerrar Sesión</button>}
      </div>
    </nav>
  );
}