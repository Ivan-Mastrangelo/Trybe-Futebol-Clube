import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import LeaderboardAwayService from '../services/LeaderboardAwayService';

class LeaderboardAwayController {
  public service = new LeaderboardAwayService();

  public leaderboard = async (_req: Request, res: Response, next: NextFunction):
  Promise<Response | void> => {
    try {
      const awayBoard = await this.service.sortedTable();

      return res.status(StatusCodes.OK).json(awayBoard);
    } catch (error) {
      next(error);
    }
  };
}

export default LeaderboardAwayController;
