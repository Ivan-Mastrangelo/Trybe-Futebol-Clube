import ITeam from '../interfaces/TeamInterface';
import Team from '../database/models/TeamModel';

class TeamService {
  public getAllTeams = async (): Promise<ITeam[]> => {
    const teams = await Team.findAll();

    return teams as ITeam[];
  };
}

export default TeamService;
