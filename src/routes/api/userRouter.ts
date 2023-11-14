import { Application } from 'express';
import {
  confirm,
  deleteUser,
  forgotPassword,
  profile,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateUser
} from '../../controllers/users.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';
import authenticate from '../../middlewares/authenticate.middleware';
import Validator from '../../middlewares/validators/validator';

const userRouter = (app: Application) => {
  app
    .route('/users/sign-in')
    .get(signIn.get)
    .post(Validator.users.signIn, signIn.post)
    .all(errorHandler);

  app
    .route('/users/sign-up')
    .get(signUp.get)
    .post(Validator.users.signUp, signUp.post)
    .all(errorHandler);

  app.route('/users/sign-out').get(signOut).all(errorHandler);

  app
    .route('/users/forgot-password')
    .get(forgotPassword.get)
    .post(Validator.users.forgotPassword, forgotPassword.post)
    .all(errorHandler);

  app
    .route('/users/reset-password/:token')
    .get(resetPassword.get)
    .post(Validator.users.resetPassword, resetPassword.post)
    .all(errorHandler);

  app.route('/confirm/:token').get(Validator.users.confirm, confirm).all(errorHandler);

  app
    .route('/users/profile')
    .all(authenticate)
    .get(profile)
    .put(Validator.users.update, updateUser)
    .delete(deleteUser)
    .all(errorHandler);
};

export default userRouter;
