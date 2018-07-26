import { Service } from 'egg';

class UserService extends Service {

  async login(username: string, password: string) {
    // const test = this.app.mysql.query(`select * from t_user`);
    // tslint:disable-next-line:no-console
    console.log(await this.app.mysql.query('select * from t_user'));
    // tslint:disable-next-line:no-console
    console.log(username, password);
  }

}

export default UserService;
