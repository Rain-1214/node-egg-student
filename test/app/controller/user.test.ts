import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import AjaxReturn from '../../../app/entity/AjaxReturn';

describe('test/app/controller/user.test.ts', () => {
  describe ('should POST /login', async () => {
    let ctx;
    beforeEach(() => {
      app.mockCsrf();
      app.mockService('user', 'login', (username, password) => {
        if (username === '123' && password === '123') {
          return {
            uid: 123,
            userAuthor: 1,
          };
        } else {
          return 'errorMessage';
        }
      });
      ctx = app.mockContext({ session: {} });
    });
    it('should POST /login success', async () => {
      const result = await app.httpRequest()
                              .post('/login')
                              .type('form')
                              .send({ username: '123', password: '123' })
                              .expect(200);
      const resultBody = JSON.parse(result.text);
      assert.equal(ctx.session.uid, 123);
      assert.equal(resultBody.stateCode, 1);
      assert.equal(resultBody.message, 'success');
      assert.equal(resultBody.data.userAuthor, 1);
    });

    it('should POST /login fail', async () => {
      const result = await app.httpRequest()
                              .post('/login')
                              .type('form')
                              .send({ username: '123', password: '123123' })
                              .expect(200);
      const resultBody = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, 'errorMessage');
    });

  });

  describe('should POST /logout', async () => {
    let ctx;
    beforeEach(() => {
      app.mockCsrf();
      ctx = app.mockContext({ session: { uid: 123 } });
    });
    it ('should POST /logout success', async () => {
      assert.equal(ctx.session.uid, 123);
      const result = await app.httpRequest()
                              .post('/logout')
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 1);
      assert.equal(resultBody.message, 'success');
    });
    it ('should POST /logout fail(登录信息不存在)', async () => {
      ctx = app.mockContext({ session: {} });
      const result = await app.httpRequest()
                              .post('/logout')
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '登录信息不存在');
    });
  });

  describe('should POST /getEmailCode', async () => {
    beforeEach(() => {
      app.mockCsrf();
      app.mockService('user', 'sendVerificationCode', (email) => {
        return email === 'fail@xx.xx' ? 'sendVerificationCode' : true;
      });
    });
    it ('should POST /getEmailCode success', async () => {
      const result = await app.httpRequest()
                              .post('/getEmailCode')
                              .send({ email: '123456@gmail.com' })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 1);
      assert.equal(resultBody.message, 'success');
    });

    it ('should POST /getEmailCode fail(邮箱格式错误)', async () => {
      const result = await app.httpRequest()
                              .post('/getEmailCode')
                              .send({ email: '123/*--++-*/--*456@gmail.com' })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '邮箱格式错误');
    });

    it ('should POST /getEmailCode fail(验证码发送失败)', async () => {
      const result = await app.httpRequest()
                              .post('/getEmailCode')
                              .type('form')
                              .send({ email: 'fail@xx.xx' })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, 'sendVerificationCode');
    });
  });

  describe('should PUT /register', async () => {
    let ctx;
    beforeEach(() => {
      app.mockCsrf();
      app.mockService('user', 'register', (username) => {
        return username === '123123' ? '用户已被占用' : 123;
      });
      ctx = app.mockContext({ session: {} });
    });
    it ('should PUT /register success', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '123132a',
                                password: '12123123',
                                email: 'asdfasdf@qq.com',
                                code: '123',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(ctx.session.uid, 123);
      assert.equal(resultBody.stateCode, 1);
      assert.equal(resultBody.message, 'success');
    });
    it ('should PUT /register fail(用户名为空)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '',
                                password: '12123123',
                                email: 'asdfasdf@qq.com',
                                code: '123',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '非法参数');
    });
    it ('should PUT /register fail(密码为空)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '12123123',
                                password: '',
                                email: 'asdfasdf@qq.com',
                                code: '123',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '非法参数');
    });
    it ('should PUT /register fail(邮箱为空)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '12123123',
                                password: '12123123',
                                email: '',
                                code: '123',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '非法参数');
    });
    it ('should PUT /register fail(验证码为空)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '12123123',
                                password: '1212312',
                                email: 'asdfasdf@qq.com',
                                code: '',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '非法参数');
    });
    it ('should PUT /register fail(用户名被占用)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '123123',
                                password: '1212312',
                                email: 'asdfasdf@qq.com',
                                code: '121223',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '用户已被占用');
    });
    it ('should PUT /register fail(邮箱地址无效-非法字符)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '123123',
                                password: '1212312',
                                email: 'asdf/*/*/*asdf@qq.com',
                                code: '121223',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '无效的邮箱');
    });
    it ('should PUT /register fail(用户名格式有误-过短)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '123',
                                password: '1212312',
                                email: 'asdfasdf@qq.com',
                                code: '121223',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '用户名格式有误');
    });
    it ('should PUT /register fail(密码格式有误-过短)', async () => {
      const result = await app.httpRequest()
                              .put('/register')
                              .send({
                                username: '123123123',
                                password: '123',
                                email: 'asdfasdf@qq.com',
                                code: '121223',
                              })
                              .expect(200);
      const resultBody: AjaxReturn<any> = JSON.parse(result.text);
      assert.equal(resultBody.stateCode, 0);
      assert.equal(resultBody.message, '密码格式有误');
    });
  });

});
