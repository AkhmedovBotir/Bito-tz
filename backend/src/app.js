import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { registerModules } from './modules/index.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { notFound } from './shared/middleware/notFound.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mini-erp-api' });
});

registerModules(app);

app.use(notFound);
app.use(errorHandler);

export default app;
