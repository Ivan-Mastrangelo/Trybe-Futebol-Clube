import { Router } from 'express';
import MatcheController from '../controllers/MatcheController';
import tokenVerify from '../middlewares/ValidateToken';

const matcheController = new MatcheController();

const route = Router();

route.get('/', matcheController.getAllMatches);
route.post('/', tokenVerify, matcheController.createMatcheInProgress);
route.patch('/:id/finish', matcheController.setMatcheToFinished);

export default route;
