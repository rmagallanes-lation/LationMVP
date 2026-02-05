import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './contact';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// CORS configuration: allow frontend origin
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/contact', contactRouter);

app.get('/_health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
