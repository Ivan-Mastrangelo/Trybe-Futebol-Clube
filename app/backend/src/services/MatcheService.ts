import Matche from '../database/models/MatcheModel';
import Team from '../database/models/TeamModel';

class MatcheService {
  public getAllMatches = async (): Promise<Matche[]> => {
    const matches = await Matche.findAll({
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: { exclude: ['id'] },
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  };

  public getAllMatchesInProgress = async (): Promise<Matche[]> => {
    const matchesInProgress = await Matche.findAll({ where: { inProgress: true },
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: { exclude: ['id'] },
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matchesInProgress;
  };

  public getAllFinishedMatches = async (): Promise<Matche[]> => {
    const finishedMatches = await Matche.findAll({ where: { inProgress: false },
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: { exclude: ['id'] },
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return finishedMatches;
  };
}

export default MatcheService;
