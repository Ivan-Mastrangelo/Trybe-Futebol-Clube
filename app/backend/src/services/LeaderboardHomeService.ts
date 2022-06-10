import ILeaderboard from '../interfaces/LeaderboardInterface';
import Matche from '../database/models/MatcheModel';
import Team from '../database/models/TeamModel';

const createTeamRow = (name: string) => ({
  name,
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
});

const eachRow = (teamRow: ILeaderboard, game: Matche) => {
  const column = teamRow;
  column.totalGames += 1;
  column.goalsFavor += game.homeTeamGoals;
  column.goalsOwn += game.awayTeamGoals;
  column.goalsBalance += game.homeTeamGoals - game.awayTeamGoals;
  if (game.homeTeamGoals > game.awayTeamGoals) column.totalVictories += 1;
  if (game.homeTeamGoals > game.awayTeamGoals) column.totalPoints += 3;
  if (game.homeTeamGoals === game.awayTeamGoals) column.totalDraws += 1;
  if (game.homeTeamGoals === game.awayTeamGoals) column.totalPoints += 1;
  if (game.homeTeamGoals < game.awayTeamGoals) column.totalLosses += 1;
  column.efficiency = +((column.totalPoints / (column.totalGames * 3)) * 100).toFixed(2);
  return column;
};

class LeaderboardHomeService {
  public leaderboard = async (): Promise<ILeaderboard[]> => {
    const allFinishedMatches = await Matche.findAll({ where: { inProgress: false } });
    const allTeams = await Team.findAll();
    const teamTable = allTeams.map((team) => {
      const teamRow = createTeamRow(team.teamName);
      allFinishedMatches.filter((matche) => matche.homeTeam === team.id)
        .forEach((game) => eachRow(teamRow, game));
      return teamRow;
    });
    return teamTable as ILeaderboard[];
  };

  public async sortedTable() {
    const lastBoard = await this.leaderboard();
    const sorted = lastBoard.sort((a, b) => {
      if (b.totalPoints > a.totalPoints) return 1;
      if (b.totalPoints < a.totalPoints) return -1;
      if (b.totalVictories > a.totalVictories) return 1;
      if (b.totalVictories < a.totalVictories) return -1;
      if (b.goalsBalance > a.goalsBalance) return 1;
      if (b.goalsBalance < a.goalsBalance) return -1;
      if (b.goalsFavor > a.goalsFavor) return 1;
      if (b.goalsFavor < a.goalsFavor) return -1;
      if (b.goalsOwn > a.goalsOwn) return -1;
      if (b.goalsOwn < a.goalsOwn) return 1;
      return 0;
    });
    return sorted;
  }
}

export default LeaderboardHomeService;
