import { Controller } from 'egg';
import AjaxReturn from '../entity/AjaxReturn';
import Tool from '../tool/Tool';

class UserController extends Controller {

  async login() {
    const { username, password } = this.ctx.query;
    if (!Tool.checkParamValid(username, password)) {
      this.ctx.body = new AjaxReturn(0, '非法参数');
      return;
    }
    // tslint:disable-next-line:no-console
    console.log(1);
    await this.ctx.service.user.login(username, password);
    this.ctx.body = 'success';
  }

}

export default UserController;
