import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/LeaderboardService';

class LeaderboardController {
  public service = new LeaderboardService();

  public leaderboard = async (_req: Request, res: Response, next: NextFunction):
  Promise<Response | void> => {
    try {
      const generalBoard = await this.service.sortedTable();

      return res.status(StatusCodes.OK).json(generalBoard);
    } catch (error) {
      next(error);
    }
  };
}

export default LeaderboardController;
