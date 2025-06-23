// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardVendedor from './pages/DashboardVendedor';


const App = () => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // para evitar render anticipado

  useEffect(() => {
    // Obtener sesión activa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setRole(data.role);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Router>
      <Routes>
        {/* Redirección inteligente según el rol */}
        <Route
          path="/"
          element={
            session ? (
              role === 'admin' ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/vendedor/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/dashboard"
          element={
            session && role === 'admin' ? <DashboardAdmin /> : <Navigate to="/" />
          }
        />
        <Route
          path="/vendedor/dashboard"
          element={
            session && role === 'vendedor' ? <DashboardVendedor /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
