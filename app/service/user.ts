import { Service } from 'egg';
import UserDao from '../dao/user';
import { UserState } from '../entity/User';
import { Encryption } from '../tool/encryption';

class UserService extends Service {

  private userdao: UserDao = UserDao.getInstance();
  private encryption: Encryption = Encryption.getInstance();
  private userState: UserState = UserState.getInstance();

  async login(username: string, password: string): Promise<{ uid: number, userAuthor: string } | string> {
    const user = await this.userdao.findUserByUsername(this.app, username);
    if (user.length === 0) {
      return '用户不存在';
    }
    const afterEncryptPass = this.encryption.getEncryptString(password);
    if (afterEncryptPass !== password) {
      return '密码错误';
    }
    const currentUser = user[0];
    const userAuthor = this.userState.getUserRole(currentUser.authorization as number);
    return {
      uid: currentUser.id as number,
      userAuthor,
    };
  }

}

export default UserService;
