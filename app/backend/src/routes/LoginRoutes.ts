import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import validateUserLogin from '../middlewares/ValidateUserLogin';

const loginController = new LoginController();

const route = Router();

route.post('/', validateUserLogin, loginController.login);

export default route;
