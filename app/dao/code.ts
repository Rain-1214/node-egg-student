import { Application } from 'egg';
import { SqlRsult } from '../../typings';
import { Code } from '../entity/Code';

class CodeDao {

  private static instance: CodeDao;

  private constructor () {};

  public static getInstance(): CodeDao {
    if (!this.instance) {
      this.instance = new CodeDao();
    }
    return this.instance;
  }

  async getCodeByEmailAndCodeState(app: Application, emailAddress: string, codeState: number): Promise<Code[]> {
    const sql = `select * from t_code where email = ? and codeState = ?`;
    const codes = await app.mysql.query<Code[]>(sql, [emailAddress, codeState]);
    return codes;
  }

  async createCode(app: Application, code: Code): Promise<SqlRsult> {
    const sql = `insert into t_code values(null,?,?,?,?)`;
    const result = await app.mysql.query<SqlRsult>(sql , [code.code, code.state, code.time, code.email]);
    return result;
  }

  async updateCodeState(app: Application, codeId: number, codeState: number): Promise<SqlRsult> {
    const sql = `update t_code set state = ? where id = ?`;
    const result = await app.mysql.query<SqlRsult>(sql, [codeState, codeId]);
    return result;
  }

}

export default CodeDao;
