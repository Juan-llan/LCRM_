import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('🚪 Sesión cerrada correctamente');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
      Cerrar sesión
    </button>
  );
}
