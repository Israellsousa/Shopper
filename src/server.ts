import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/MeasureRoutes';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Configuração de rotas
app.use('/api', routes);

// Definir a porta para o servidor
const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
