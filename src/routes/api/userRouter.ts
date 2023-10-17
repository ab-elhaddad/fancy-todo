import { Application } from 'express';
import { confirm, forgotPassword, resetPassword, signIn, signOut, signUp } from '../../controllers/users.controller';
import { signInValidator, signUpValidator } from '../../middlewares/validators/users.validator';
import errorHandler from '../../middlewares/errorHandler.middleware';
import authenticate from '../../middlewares/authenticate.middleware';

const userRouter = (app: Application) => {
	app.get('/users/sign-in', signIn.get, errorHandler);
	app.post('/users/sign-in', signInValidator, signIn.post, errorHandler);
	app.get('/users/sign-up', signUp.get, errorHandler);
	app.post('/users/sign-up', signUpValidator, signUp.post, errorHandler);
	app.get('/users/sign-out', authenticate, signOut, errorHandler);
	app.get('/users/forgot-password', forgotPassword.get, errorHandler);
	app.post('/users/forgot-password', forgotPassword.post, errorHandler);
	app.get('/users/reset-password/:token', resetPassword.get, errorHandler);
	app.post('/users/reset-password/:token', resetPassword.post, errorHandler);
	app.get('/confirm/:token', confirm, errorHandler);
};

export default userRouter;
