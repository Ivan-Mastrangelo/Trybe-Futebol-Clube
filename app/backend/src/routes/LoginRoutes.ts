import { Router } from 'express';
import tokenVerify from '../middlewares/ValidateToken';
import LoginController from '../controllers/LoginController';
import validateUserLogin from '../middlewares/ValidateUserLogin';

const loginController = new LoginController();

const route = Router();

route.post('/', validateUserLogin, loginController.login);
route.get('/validate', tokenVerify, loginController.loginValidate);

export default route;
