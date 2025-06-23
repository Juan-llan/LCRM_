import express from 'express';
import supabase from '../db/supabase.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  const { data, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: userId, full_name: name, role: 'vendedor' }]);

  if (profileError) return res.status(400).json({ error: profileError.message });

  const token = jwt.sign({ id: userId, role: 'vendedor' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError || !data.user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return res.status(403).json({ error: 'Perfil no encontrado' });

  const token = jwt.sign({ id: userId, role: profile.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
