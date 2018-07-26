import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    this.ctx.body = await this.ctx.service.test.sayHi('egg');
  }
}
