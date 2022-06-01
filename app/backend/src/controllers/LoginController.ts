import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import LoginService from '../services/LoginService';

class LoginController {
  public service = new LoginService();

  public login = async (req: Request, res: Response, next: NextFunction):
  Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const userLogged = await this.service.login(email, password);

      if (userLogged === 'user not found') {
        return res.status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Incorrect email or password' });
      }
      return res.status(StatusCodes.OK).json(userLogged);
    } catch (error) {
      next(error);
    }
  };
}

export default LoginController;
