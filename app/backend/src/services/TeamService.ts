import ITeam from '../interfaces/TeamInterface';
import Team from '../database/models/TeamModel';

class TeamService {
  public getAllTeams = async (): Promise<ITeam[]> => {
    const teams = await Team.findAll();

    return teams as ITeam[];
  };

  public getTeamById = async (id: number): Promise<ITeam> => {
    const team = await Team.findByPk(id);
    return team as ITeam;
  };
}

export default TeamService;
