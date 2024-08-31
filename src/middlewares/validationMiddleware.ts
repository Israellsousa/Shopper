import { Request, Response, NextFunction } from 'express';
import { validateUploadRequest, validateConfirmRequest } from '../utils/Validation';

// Middleware para validar as requisições de upload
export function validateUpload(req: Request, res: Response, next: NextFunction) {
  const { error } = validateUploadRequest(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error_code: 'VALIDATION_ERROR', 
      error_description: error 
    });
  }
  
  next();
}

// Middleware para validar as requisições de confirmação
export function validateConfirm(req: Request, res: Response, next: NextFunction) {
  const { error } = validateConfirmRequest(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error_code: 'VALIDATION_ERROR', 
      error_description: error 
    });
  }
  
  next();
}
