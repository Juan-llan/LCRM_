// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardVendedor from './pages/DashboardVendedor';
import Clients from './pages/Clients';

const App = () => {
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload?.id) throw new Error('Token corrupto');
        setRole(payload.role);
        setSession(true);
        console.log('✅ Sesión iniciada correctamente. Rol:', payload.role);
      } catch (e) {
        console.error('❌ Token inválido. Cerrando sesión automáticamente.');
        localStorage.removeItem('token');
        setSession(false);
      }
    } else {
      console.log('ℹ️ No hay token presente. Usuario no autenticado.');
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          session ? (
            role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/vendedor/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={session && role === 'admin' ? <DashboardAdmin /> : <Navigate to="/" />} />
        <Route path="/vendedor/dashboard" element={session && role === 'vendedor' ? <DashboardVendedor /> : <Navigate to="/" />} />
        <Route path="/clientes" element={session ? <Clients /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
