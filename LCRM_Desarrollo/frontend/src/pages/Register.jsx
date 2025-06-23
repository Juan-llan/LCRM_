// src/pages/Register.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
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

    // 1. Crear cuenta de usuario (auth)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }

    // 2. Iniciar sesión para autenticar al usuario (activar auth.uid())
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData.user) {
      setErrorMsg('Error al iniciar sesión después del registro.');
      return;
    }

    const userId = loginData.user.id;

    // 3. Insertar perfil en la tabla 'profiles' (el usuario ya está autenticado)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          full_name: name,
          role: 'vendedor', // asignación por defecto
        },
      ]);

    if (profileError) {
      setErrorMsg('Error al guardar perfil: ' + profileError.message);
      return;
    }

    // 4. Redirigir al dashboard correspondiente
    navigate('/vendedor/dashboard');
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
