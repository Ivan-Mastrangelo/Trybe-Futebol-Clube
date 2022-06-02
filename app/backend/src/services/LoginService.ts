import * as bcrypt from 'bcryptjs';
import ILogin from '../interfaces/LoginInterface';
import User from '../database/models/UserModel';
import tokenGenerate from '../helpers/TokenGenerate';

class LoginService {
  public login = async (email: string, password: string): Promise<ILogin | string> => {
    const user = await User.findOne({ where: { email } });
    if (!user) return ('user not found');
    const hash = bcrypt.compareSync(password, user.password);
    if (hash === false) return ('user not found');
    const { id, username } = user;
    const userToken = tokenGenerate(id, username);

    return {
      user: {
        id,
        username,
        role: user.role,
        email,
      },
      token: userToken,
    } as ILogin;
  };

  public loginValidate = async (userId: number): Promise<string> => {
    const user = await User.findByPk(userId);
    if (!user) return ('non-existent user');

    return user.role;
  };
}

export default LoginService;
