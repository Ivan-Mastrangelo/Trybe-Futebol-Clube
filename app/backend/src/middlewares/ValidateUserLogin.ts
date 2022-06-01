import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const productSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { error } = productSchema.validate({ email, password });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'All fields must be filled' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateUserLogin;
