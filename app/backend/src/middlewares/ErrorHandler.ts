import { Request, Response, NextFunction, Errback } from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';

const errorHandler = (
  err: Errback,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // if (err.errorCode) return res.status(err.errorCode).json({ message: err.message });
  console.log(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Wow! Something is wrong' });
};

export default errorHandler;
