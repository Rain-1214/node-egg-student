import { Service } from 'egg';
import CodeDao from '../dao/code';
import UserDao from '../dao/user';
import { Code, CodeState } from '../entity/Code';
import { User, UserState } from '../entity/User';
import { Email } from '../tool/email';
import { Encryption } from '../tool/encryption';
import Tool from '../tool/Tool';

class UserService extends Service {

  private userdao: UserDao = UserDao.getInstance();
  private codedao: CodeDao = CodeDao.getInstance();
  private encryption: Encryption = Encryption.getInstance();
  private userState: UserState = UserState.getInstance();
  private email: Email = Email.getInstance();

  async login(username: string, password: string): Promise<{ uid: number, userAuthor: string } | string> {
    const user = await this.userdao.findUserByUsername(this.app, username);
    if (user.length === 0) {
      return '用户不存在';
    }
    const currentUser = user[0];
    const afterEncryptPass = this.encryption.getEncryptString(password);
    if (afterEncryptPass !== currentUser.password) {
      return '密码错误';
    }
    const userAuthor = this.userState.getUserRole(currentUser.authorization as number);
    return {
      uid: currentUser.id as number,
      userAuthor,
    };
  }

  async createVerificationCode(email: string): Promise<{ result: boolean, codeStr?: string, inserteId?: number }> {
    const codeStr = Tool.createRandomNumber(0, 999999).toString().padStart(6, '0');
    const code = new Code(null, codeStr, CodeState.CODE_CAN_USE, new Date().getTime(), email);
    const result = await this.codedao.createCode(this.app, code);
    this.ctx.logger.error(`生成验证码错误:${result}`);
    if (result.changedRows === 1) {
      return {
        result: true,
        codeStr,
        inserteId: result.insertId,
      };
    } else {
      return {
        result: false,
      };
    }
  }

  async sendVerificationCode(email: string): Promise<string | boolean> {
    this.ctx.logger.info(`向${email}发送验证码`);
    const canUseCode = await this.findLatestCode(email);
    if (canUseCode) {
      this.email.send(email, '验证码', `<p>【NODEJS】 您的验证码为 ${canUseCode} </p>`);
      this.ctx.logger.info(`向${email}发送验证码成功`);
      return true;
    } else {
      return '发送验证码的过程中发生了错误';
    }
  }

  async register(username: string, password: string, email: string, code: string): Promise<number | string> {
    if (!Tool.checkEmail(email)) {
      return '无效的邮箱';
    }
    if (!Tool.checkValidChar(username)) {
      return '用户名格式有误';
    }
    if (!Tool.checkValidChar(password)) {
      return '密码格式有误';
    }
    const users = await this.userdao.findUserByUsername(this.app, username);
    if (users.length !== 0) {
      return '用户名已被占用';
    }
    const codeRight = await this.findLatestCode(email);
    if (codeRight) {
      if (codeRight !== code) {
        return '验证码错误';
      }
    } else {
      this.ctx.logger.info(`查找验证码发生错误`);
      return '未知错误';
    }
    const user = new User(
      null,
      username,
      this.encryption.getEncryptString(password),
      email,
      this.userState.AUTHOR_VISITOR,
      this.userState.USER_CAN_USE,
    );
    const result = await this.userdao.createUser(this.app, user);
    if (result.changedRows === 1) {
      return '注册失败，请重试';
    }
    return result.insertId;
  }

  public async getUser(userId: number): Promise<User[] | string> {
    const userAuthor = await this.userdao.fingUserAuthorByUserId(this.app, userId);
    if (userAuthor.length === 0) {
      return '获取用户登录信息失败'
    }
    if (this.userState.checkAuthor('user', 'all', userAuthor[0])) {
    }
    return '';
  }

  private async findLatestCode(email: string): Promise<string | null> {
    const codes = await this.codedao.getCodeByEmailAndCodeState(this.app, email, CodeState.CODE_CAN_USE);
    let canUseCode: string;
    if (codes.length === 0) {
      this.ctx.logger.info(`没有查到可用验证码,生成新的验证码`);
      const createCodeResult = await this.createVerificationCode(email);
      if (createCodeResult.result) {
        canUseCode = createCodeResult.codeStr as string;
      } else {
        this.ctx.logger.error(`插入新的验证码时发生错误`);
        return null;
      }
    } else {
      const tempCode = codes[0];
      this.ctx.logger.info(`查到可用验证码,${tempCode}`);
      if (!CodeState.checkCodeTimeIsValid(tempCode)) {
        this.ctx.logger.info(`验证码已失效，准备生成新的验证码,${tempCode}`);
        const result = await this.codedao.updateCodeState(
          this.app,
          tempCode.id as number,
          CodeState.CODE_ALREADY_INVALID,
        );
        if (result.affectedRows !== 1) {
          this.ctx.logger.error('在修改验证码状态时发生错误');
          return null;
        }
        const createCodeResult = await this.createVerificationCode(email);
        if (createCodeResult.result) {
          this.ctx.logger.error(`插入新的验证码时发生错误`);
          canUseCode = createCodeResult.codeStr as string;
        } else {
          return null;
        }
      } else {
        canUseCode = tempCode.code as string;
      }
    }
    return canUseCode;
  }

}

export default UserService;
