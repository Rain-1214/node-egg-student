import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/login', controller.user.login);
  router.post('/logout', controller.user.logout);
  router.post('/getEmailCode', controller.user.getEmailCode);
  router.put('/register', controller.user.register);
};
