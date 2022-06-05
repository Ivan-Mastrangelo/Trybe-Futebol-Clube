import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import MatcheService from '../services/MatcheService';

class MatcheController {
  public service = new MatcheService();

  public getAllMatches = async (_req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      const allMatches = await this.service.getAllMatches();

      return res.status(StatusCodes.OK).json(allMatches);
    } catch (error) {
      next(error);
    }
  };
}

export default MatcheController;
