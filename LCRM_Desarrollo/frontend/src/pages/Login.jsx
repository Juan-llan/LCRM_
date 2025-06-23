// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
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

    const { data: sessionData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Credenciales incorrectas o error en el inicio de sesión.');
      return;
    }

    if (sessionData?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionData.user.id)
        .single();

      if (profileError || !profile) {
        setErrorMsg('Perfil no encontrado. Contacta al administrador.');
        return;
      }

      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (profile.role === 'vendedor') {
        navigate('/vendedor/dashboard');
      } else {
        setErrorMsg('Rol no reconocido. Contacta al administrador.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
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
