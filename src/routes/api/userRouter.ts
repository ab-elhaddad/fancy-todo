import { Application } from 'express';
import { confirm, deleteUser, forgotPassword, profile, resetPassword, signIn, signOut, signUp, updateUser } from '../../controllers/users.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';
import authenticate from '../../middlewares/authenticate.middleware';
import Validator from '../../middlewares/validators/validator';

const userRouter = (app: Application) => {
	app.get('/users/sign-in',
		signIn.get,
		errorHandler);
	app.post('/users/sign-in',
		Validator.users.signIn,
		signIn.post,
		errorHandler);
	app.get('/users/sign-up',
		signUp.get,
		errorHandler);
	app.post('/users/sign-up',
		Validator.users.signUp,
		signUp.post,
		errorHandler);
	app.get('/users/sign-out',
		authenticate,
		signOut,
		errorHandler);
	app.get('/users/forgot-password',
		forgotPassword.get,
		errorHandler);
	app.post('/users/forgot-password',
		Validator.users.forgotPassword,
		forgotPassword.post,
		errorHandler);
	app.get('/users/reset-password/:token',
		resetPassword.get,
		errorHandler);
	app.post('/users/reset-password/:token',
		Validator.users.resetPassword,
		resetPassword.post,
		errorHandler);
	app.get('/confirm/:token',
		Validator.users.confirm,
		confirm,
		errorHandler);
	app.get('/users/profile',
		authenticate,
		profile,
		errorHandler);
	app.put('/users/profile',
		authenticate,
		Validator.users.update,
		updateUser,
		errorHandler);
	app.delete('/users/profile',
		authenticate,
		deleteUser,
		errorHandler);
};

export default userRouter;
