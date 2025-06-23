// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.removeItem('token'); // limpia el token anterior
      localStorage.setItem('token', data.token);

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      console.log('🔐 Login exitoso. Rol:', payload.role);

      if (payload.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendedor/dashboard');
      }
    } catch (err) {
      setErrorMsg('Error en la conexión con el servidor');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Ingresar</button>
          </form>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <div className="toggle">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </div>
        </div>
      </div>
    </>
  );
}
