import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import IToken from '../interfaces/TokenInterface';

const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token not found' });
    }
    const secretKey = fs.readFileSync('jwt.evaluation.key');
    const payload = jwt.verify(token, secretKey);
    const newPayload = payload as IToken;
    req.body.user = newPayload.id;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};

export default tokenVerify;
