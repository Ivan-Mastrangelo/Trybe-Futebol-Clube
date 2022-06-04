import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class Team extends Model {
  id!: number;
  teamName!: string;
}

Team.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'team',
  timestamps: false,
});

export default Team;
