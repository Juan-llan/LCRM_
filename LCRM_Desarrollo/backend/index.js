import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // o el puerto donde corre tu React (Vite por defecto)
  credentials: true
}));

app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en puerto ${PORT}`);
});