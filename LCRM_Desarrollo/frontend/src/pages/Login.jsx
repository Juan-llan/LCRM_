// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient'; // Asegúrate de tener este archivo configurado

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
        setErrorMsg('No se pudo obtener el perfil del usuario.');
        return;
      }

      // Redireccionar según el rol
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendedor/dashboard');
      }
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}

