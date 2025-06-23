// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('🚪 Sesión cerrada');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">LCRM</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/admin/dashboard">dashboard</Link></li>
        
        <li><Link to="/clientes">Clientes</Link></li>
        <li><button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button></li>
      </ul>
    </nav>
  );
}
