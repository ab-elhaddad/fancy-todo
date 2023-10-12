import { Application } from 'express';
import userRouter from './api/userRouter';
import taskRouter from './api/taskRouter';
import subtaskRouter from './api/subtaskRouter';
import listRouter from './api/listRouter';

const mainRouter = (app: Application) => {
	userRouter(app);
	taskRouter(app);
	subtaskRouter(app);
	listRouter(app);
};

export default mainRouter;
