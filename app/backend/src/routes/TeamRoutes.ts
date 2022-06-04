import { Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamController = new TeamController();

const route = Router();

route.get('/', teamController.getAllTeams);

export default route;
