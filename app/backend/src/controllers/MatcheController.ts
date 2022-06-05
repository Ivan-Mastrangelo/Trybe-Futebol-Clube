import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import MatcheService from '../services/MatcheService';

class MatcheController {
  public service = new MatcheService();

  public getAllMatches = async (req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      if (req.query.inProgress === 'true') {
        const allMatchesInProgress = await this.service.getAllMatchesInProgress();
        return res.status(StatusCodes.OK).json(allMatchesInProgress);
      }

      if (req.query.inProgress === 'false') {
        const allFinishedMatches = await this.service.getAllFinishedMatches();
        return res.status(StatusCodes.OK).json(allFinishedMatches);
      }

      const allMatches = await this.service.getAllMatches();

      return res.status(StatusCodes.OK).json(allMatches);
    } catch (error) {
      next(error);
    }
  };
}

export default MatcheController;
