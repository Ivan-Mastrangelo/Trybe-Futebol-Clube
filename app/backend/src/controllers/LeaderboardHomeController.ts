import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import LeaderboardHomeService from '../services/LeaderboardHomeService';

class LeaderboardHomeController {
  public service = new LeaderboardHomeService();

  public leaderboard = async (_req: Request, res: Response, next: NextFunction):
  Promise<Response | void> => {
    try {
      const homeBoard = await this.service.sortedTable();

      return res.status(StatusCodes.OK).json(homeBoard);
    } catch (error) {
      next(error);
    }
  };
}

export default LeaderboardHomeController;
