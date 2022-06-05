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

  public createMatcheInProgress = async (req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;
      const newInProgressMatche = await this.service
        .createMatcheInProgress(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);
      return res.status(StatusCodes.CREATED).json(newInProgressMatche);
    } catch (error) {
      next(error);
    }
  };

  public setMatcheToFinished = async (req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      const { id } = req.params;
      const changedMatcheStatus = await this.service.setMatcheToFinished(+id);
      return res.status(StatusCodes.OK).json(changedMatcheStatus);
    } catch (error) {
      next(error);
    }
  };
}

export default MatcheController;
