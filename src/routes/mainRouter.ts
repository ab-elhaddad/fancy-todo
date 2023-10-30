import { Application, Request, Response } from 'express';
import userRouter from './api/userRouter';
import taskRouter from './api/taskRouter';
import subtaskRouter from './api/subtaskRouter';
import listRouter from './api/listRouter';
import insightsRouter from './api/insightsRouter';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const mainRouter = (app: Application) => {
	app.get('/', (req: Request, res: Response) => {
		const token = cookie.parse(req.headers.cookie as string).token;
		if (token)
			res.redirect('/welcome');
		else
			res.render('index');
	});

	app.get('/welcome', (req: Request, res: Response) => {
		const token = cookie.parse(req.headers.cookie as string).token;
		if (!token)
			res.redirect('/');
		else {
			const user = jwt?.decode(token) as jwt.JwtPayload;
			res.render('welcome', { name: user.email });
		}
	});
	userRouter(app);
	taskRouter(app);
	subtaskRouter(app);
	listRouter(app);
	insightsRouter(app);
};

export default mainRouter;
