// src/pages/Register.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Asegúrate de tener este archivo configurado
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Registrar al usuario en Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }

    // 2. Crear su perfil en la tabla `profiles`
    if (signUpData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: signUpData.user.id,
            full_name: name,
            role: 'vendedor', // Cambia a 'admin' si quieres crear un admin
          },
        ]);

      if (profileError) {
        setErrorMsg(profileError.message);
        return;
      }

      // 3. Redirige al login tras registro exitoso
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registrar</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}

