import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/MeasureRoutes';
import { errorHandler } from './middlewares/errorHandlerMiddleware';
import { authenticate } from './middlewares/authMiddleware';

dotenv.config();

const app = express();

app.use(express.json());

// Middleware de autenticação
app.use(authenticate);

// Rotas para as medições
app.use('/measure', measureRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
