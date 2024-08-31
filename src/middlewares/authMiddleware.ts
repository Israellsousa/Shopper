import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.GEMINI_API_KEY}`) {
    return res.status(401).json({ error_code: 'UNAUTHORIZED', error_description: 'Token de autenticação inválido' });
  }
  next();
}
