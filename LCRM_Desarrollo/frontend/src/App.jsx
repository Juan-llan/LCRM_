// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient' // Asegúrate de tener este archivo configurado
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Obtener sesión activa al iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escuchar cambios en la sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              <div>
                <h1>Bienvenido</h1>
                <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
