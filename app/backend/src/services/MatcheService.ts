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
}

export default MatcheService;
