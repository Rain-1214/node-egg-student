import * as Mysql from 'egg-mysql';

declare module 'egg' {

  interface Application {
    mysql: {
      query(sql: string, values?: any[]),
    };
  }

}