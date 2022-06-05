import { Router } from 'express';
import MatcheController from '../controllers/MatcheController';

const matcheController = new MatcheController();

const route = Router();

route.get('/', matcheController.getAllMatches);

export default route;
