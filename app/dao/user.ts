import { Application } from 'egg';
import { User } from '../entity/User';

class UserDao {

  private static instance: UserDao;

  private constructor() {};

  public static getInstance(): UserDao {
    if (!this.instance) {
      this.instance = new UserDao();
    }
    return this.instance;
  }

  public async findUserByUsername (app: Application, username: string): Promise<User[]> {
    const sql = `select * from t_user where username = ?`;
    const result = await app.mysql.query<User[]>(sql, [username]);
    return result;
  }

}

export default UserDao;