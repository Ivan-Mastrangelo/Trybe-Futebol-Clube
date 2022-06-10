import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';
import LeaderboardAwayController from '../controllers/LeaderboardAwayController';

const leaderboardController = new LeaderboardController();
const leaderboardHomeController = new LeaderboardHomeController();
const leaderboardAwayController = new LeaderboardAwayController();

const route = Router();

route.get('/', leaderboardController.leaderboard);
route.get('/home', leaderboardHomeController.leaderboard);
route.get('/away', leaderboardAwayController.leaderboard);

export default route;
