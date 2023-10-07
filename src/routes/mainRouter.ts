import { Application } from 'express';
import userRouter from './api/userRouter';
import taskRouter from './api/taskRouter';
import subtaskRouter from './api/subtaskRouter';

const mainRouter = (app: Application) => {
	userRouter(app);
	taskRouter(app);
	subtaskRouter(app);
};

export default mainRouter;
