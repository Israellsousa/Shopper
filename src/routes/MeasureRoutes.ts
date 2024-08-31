import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controllers/MeasureController';
import { validateUpload, validateConfirm } from '../middlewares/validationMiddleware'; // Importa os middlewares de validação

const router = Router();

// Rota para upload de medições com validação
router.post('/upload', validateUpload, uploadMeasure);

// Rota para confirmar medições com validação
router.patch('/confirm', validateConfirm, confirmMeasure);

// Rota para listar medições
router.get('/:customerCode/list', listMeasures);

export default router;
