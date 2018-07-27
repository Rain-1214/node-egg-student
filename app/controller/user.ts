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
    const result = await this.ctx.service.user.login(username, password);
    if (typeof result === 'string') {
      this.ctx.body = new AjaxReturn(0, result);
    } else {
      this.ctx.body = new AjaxReturn(1, 'success', result);
    }
  }

}

export default UserController;
