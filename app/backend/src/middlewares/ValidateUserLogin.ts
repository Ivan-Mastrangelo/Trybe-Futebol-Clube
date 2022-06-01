import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const productSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).messages({
  'string.email': 'Incorrect email or password',
  'any.required': 'All fields must be filled' });

const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { error } = productSchema.validate({ email, password });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateUserLogin;
