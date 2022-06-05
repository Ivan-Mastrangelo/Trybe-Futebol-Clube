import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import TeamService from '../services/TeamService';

class TeamController {
  public service = new TeamService();

  public getAllTeams = async (_req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      const allTeams = await this.service.getAllTeams();

      return res.status(StatusCodes.OK).json(allTeams);
    } catch (error) {
      next(error);
    }
  };

  public getTeamById = async (req: Request, res: Response, next: NextFunction)
  :Promise<Response | void> => {
    try {
      const { id } = req.params;
      const team = await this.service.getTeamById(+id);

      return res.status(StatusCodes.OK).json(team);
    } catch (error) {
      next(error);
    }
  };
}

export default TeamController;
