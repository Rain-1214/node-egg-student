import * as Mysql from 'egg-mysql';
import SessionStore from '../app/public/sessionStore';

declare module 'egg' {

  interface Application {
    mysql: {
      query<T>(sql: string, values?: any[]): T,
    };
    session: SessionState;
    redis: any;
  }

}

interface SessionState {
  uid: number,
  forgetPassword: {
    email: string,
    uid: number
  }
}

interface SqlRsult {
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: String,
  protocol41: boolean,
  changedRows: number
}
