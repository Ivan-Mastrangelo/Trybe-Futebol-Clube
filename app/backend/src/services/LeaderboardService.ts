import ILeaderboard from '../interfaces/LeaderboardInterface';
import LeaderboardAwayService from './LeaderboardAwayService';
import LeaderboardHomeService from './LeaderboardHomeService';

class LeaderboardService {
  private leaderBoardHome = new LeaderboardHomeService();
  private leaderBoardAway = new LeaderboardAwayService();
  private allBoard: ILeaderboard[];
  private sorted: ILeaderboard[];

  public leaderboardAll = async (): Promise<ILeaderboard[]> => {
    const home = await this.leaderBoardHome.leaderboard();
    const away = await this.leaderBoardAway.leaderboard();
    const board = this.getLeaderBoard(home, away);
    return this.sortedTable(board);
  };

  private getLeaderBoard(homeBoard: ILeaderboard[], awayBoard: ILeaderboard[]) {
    this.allBoard = homeBoard.map((home) => awayBoard
      .reduce((acc: ILeaderboard, away: ILeaderboard) => {
        if (home.name === away.name) {
          acc.name = home.name;
          acc.totalPoints = home.totalPoints + away.totalPoints;
          acc.totalGames = home.totalGames + away.totalGames;
          acc.totalVictories = home.totalVictories + away.totalVictories;
          acc.totalDraws = home.totalDraws + away.totalDraws;
          acc.totalLosses = home.totalLosses + away.totalLosses;
          acc.goalsFavor = home.goalsFavor + away.goalsFavor;
          acc.goalsOwn = home.goalsOwn + away.goalsOwn;
          acc.goalsBalance = acc.goalsFavor - acc.goalsOwn;
          acc.efficiency = +((acc.totalPoints / (acc.totalGames * 3)) * 100).toFixed(2);
        }
        return acc;
      }, {} as ILeaderboard));
    return this.allBoard;
  }

  public async sortedTable(lastBoard: ILeaderboard[]) {
    this.sorted = lastBoard.sort((a, b) => {
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
    return this.sorted;
  }
}

export default LeaderboardService;
