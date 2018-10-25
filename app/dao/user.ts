import { Application } from 'egg';
import { SqlRsult } from '../../typings';
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

  public async createUser(app: Application, user: User): Promise<SqlRsult> {
    const sql = `insert into t_user values(null,?,?,?,?,?)`;
    const result = await app.mysql.query<SqlRsult>(
      sql,
      [user.username, user.password, user.email, user.authorization, user.userState],
    );
    return result;
  }

  public async findUserAuthorByUserId(app: Application, userId: number): Promise<number[]> {
    const sql = 'select authorization from t_user where id = ?';
    const result = await app.mysql.query<number[]>(sql, [userId]);
    return result;
  }

  public async getAllUser (app: Application, start: number, limit: number): Promise<User[]> {
    const sql = 'select * from t_user limit ?,?';
    const result = await app.mysql.query<User[]>(sql, [start, limit]);
    return result;
  }

}

export default UserDao;
