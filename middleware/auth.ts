import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});
