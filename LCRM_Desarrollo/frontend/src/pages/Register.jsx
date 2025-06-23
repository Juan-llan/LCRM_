// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al registrarse');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/vendedor/dashboard');
    } catch (err) {
      setErrorMsg('Error en la conexión con el servidor');
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <h2>Registro</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Registrarse</button>
          </form>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <div className="toggle">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </div>
        </div>
      </div>
    </>
  );
}
