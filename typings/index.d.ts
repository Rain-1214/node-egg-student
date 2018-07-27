import * as Mysql from 'egg-mysql';

declare module 'egg' {

  interface Application {
    mysql: {
      query<T>(sql: string, values?: any[]): T,
    };
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
