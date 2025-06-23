// src/pages/Clients.jsx
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', telefono: '', direccion: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3001/api/clients'; // reemplaza en producción

  const fetchClients = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setClients(data);
      else setClients([]);
    } catch (err) {
      setError('Error al obtener clientes');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error);

      setForm({ name: '', email: '', telefono: '', direccion: '' });
      setEditingId(null);
      fetchClients();
    } catch {
      setError('Error al guardar cliente');
    }
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditingId(client.id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error);
      fetchClients();
    } catch {
      setError('Error al eliminar cliente');
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container">
        <h2>Clientes</h2>

        <form onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <input placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <button type="submit">{editingId ? 'Actualizar' : 'Agregar'} Cliente</button>
        </form>

        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <p className="error-msg">{error}</p>}

        {filteredClients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.telefono}</td>
                  <td>{client.direccion}</td>
                  <td>
                    <button onClick={() => handleEdit(client)}>Editar</button>
                    <button onClick={() => handleDelete(client.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay clientes para mostrar.</p>
        )}
      </div>
    </Layout>
  );
}

