import { Controller } from 'egg';
import AjaxReturn from '../entity/AjaxReturn';
import { UserState } from '../entity/User';
import Tool from '../tool/Tool';

class UserController extends Controller {

  private userState: UserState = UserState.getInstance();

  async login() {
    const { username, password } = this.ctx.body;
    if (!Tool.checkParamValid(username, password)) {
      this.ctx.body = new AjaxReturn(0, '非法参数');
      return;
    }
    const result = await this.ctx.service.user.login(username, password);
    if (typeof result === 'string') {
      this.ctx.logger.info(`有用户登录失败，原因：${result},输入用户名和密码为:${username}${password}`);
      this.ctx.body = new AjaxReturn(0, result);
    } else {
      this.ctx.logger.info(`用户名为${username}登录成功,时间${new Date().toLocaleDateString()}`);
      this.ctx.session.uid = result.uid;
      this.ctx.body = new AjaxReturn(1, 'success', { userAuthor: result.userAuthor });
    }
  }

  async logout() {
    const uid = this.ctx.session.uid;
    if (uid === undefined) {
      this.ctx.logger.info(`接收到了未知的登出请求(登录信息不存在)`);
      this.ctx.body = new AjaxReturn(0, '登录信息不存在');
      return;
    }
    delete this.ctx.session.uid;
    this.ctx.logger.info(`用户ID为${uid}的用户登出了`);
    this.ctx.body = new AjaxReturn(1, 'success');
  }

  async getEmailCode() {
    const email = this.ctx.body;
    this.ctx.logger.info(`邮箱为${email}请求发送验证码`);
    if (!Tool.checkEmail(email)) {
      this.ctx.logger.info(`邮箱为${email}请求发送验证码,但是邮箱格式未通过验证`);
      this.ctx.body = new AjaxReturn(0, '邮箱格式错误');
      return;
    }
    const result = await this.ctx.service.user.sendVerificationCode(email);
    if (typeof result === 'string') {
      this.ctx.logger.info(`邮箱为${email}请求发送验证码并发送失败。。。`);
      this.ctx.body = new AjaxReturn(0, result);
    } else {
      this.ctx.logger.info(`邮箱为${email}请求发送验证码并发送成功`);
      this.ctx.body = new AjaxReturn(1, 'success');
    }
  }

  async register() {
    const { username, password, email, code } = this.ctx.body;
    this.ctx.logger.info(`有用户申请注册,注册信息${username},${email}`);
    if (!Tool.checkParamValid(username, password, email, code)) {
      this.ctx.body = new AjaxReturn(0, '非法参数');
      return;
    }
    const result = await this.ctx.service.user.register(username, password, email, code);
    if (typeof result === 'string') {
      this.ctx.logger.warn(`注册信息格式验证未通过,${result}`);
      this.ctx.body = new AjaxReturn(0, result);
    } else {
      this.ctx.logger.info(`注册成功,注册信息${username},${email}`);
      this.ctx.app.session.uid = result;
      this.ctx.body = new AjaxReturn(1, 'success', { userAuthor: this.userState.AUTHOR_VISITOR });
    }
  }

  async getUser() {
   // const uid = this.ctx.app.session.uid;
  }

}

export default UserController;
