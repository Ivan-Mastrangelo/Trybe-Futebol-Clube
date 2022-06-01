import * as fs from 'fs';
import { sign } from 'jsonwebtoken';

const tokenGenerate = (id: number, username: string): string => {
  const secretKey = fs.readFileSync('jwt.evaluation.key');

  const token = sign({ id, username }, secretKey, {
    expiresIn: '5d',
    algorithm: 'HS256',
  });

  return token as string;
};

export default tokenGenerate;
