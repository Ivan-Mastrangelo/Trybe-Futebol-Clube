import { Router } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';

const leaderboardHomeController = new LeaderboardHomeController();

const route = Router();

route.get('/home', leaderboardHomeController.leaderboard);

export default route;
