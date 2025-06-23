// backend/routes/clients.js
import express from 'express';
import supabase from '../db/supabase.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('❌ Token inválido o expirado:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// GET /api/clients
router.get('/', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`❌ Error al obtener clientes del usuario ${req.user.id}:`, error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log(`📥 Clientes obtenidos para el usuario ${req.user.id} (${data.length} registros)`);
  res.json(data);
});

// POST /api/clients
router.post('/', verifyToken, async (req, res) => {
  const { name, email, telefono, direccion } = req.body;

  console.log('🧪 Payload recibido:', req.body);
  console.log('🧪 Usuario autenticado:', req.user);

  const { data, error } = await supabase
    .from('clients')
    .insert([{ user_id: req.user.id, name, email, telefono, direccion }])
    .select()
    .single();

  if (error) {
    console.error(`❌ Error al crear cliente para ${req.user.id}:`, error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log(`✅ Cliente creado por ${req.user.id}: ${data.id}`);
  res.json(data);
});

// PUT /api/clients/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, telefono, direccion } = req.body;

  const { data, error } = await supabase
    .from('clients')
    .update({ name, email, telefono, direccion })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error al actualizar cliente ${id} por ${req.user.id}:`, error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log(`✏️ Cliente actualizado por ${req.user.id}: ${id}`);
  res.json(data);
});

// DELETE /api/clients/:id
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) {
    console.error(`❌ Error al eliminar cliente ${id} por ${req.user.id}:`, error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log(`🗑️ Cliente eliminado por ${req.user.id}: ${id}`);
  res.json({ success: true, id });
});

export default router;
