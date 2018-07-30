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
      this.ctx.logger.info(`有用户登录失败，原因：${result},输入用户名和密码为:${username}${password}`);
      this.ctx.body = new AjaxReturn(0, result);
    } else {
      this.ctx.logger.info(`用户名为${username}登录成功,时间${new Date().toLocaleDateString()}`)
      this.ctx.session.uid = result.uid;
      this.ctx.body = new AjaxReturn(1, 'success', result);
    }
  }

  async logout() {
    const uid = this.ctx.session.uid;
    if (uid === undefined) {
      this.ctx.body = new AjaxReturn(0, '登录信息不存在');
      return;
    }
    delete this.ctx.session.uid;
    this.ctx.logger.info(`用户ID为${uid}的用户登出了`);
    this.ctx.body = new AjaxReturn(1, 'success');
  }

}

export default UserController;
