import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import questionsRoute from './routes/questions';
import filterRoute from './routes/filter';
import healthcheck from './routes/healthcheck'; // ✅ new route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', questionsRoute);
app.use('/api', filterRoute);
app.use('/api', healthcheck); // ✅ added

app.get('/', (_req, res) => {
  res.send('MovFoo backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

