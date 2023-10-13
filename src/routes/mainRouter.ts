import { Application } from 'express';
import userRouter from './api/userRouter';
import taskRouter from './api/taskRouter';
import subtaskRouter from './api/subtaskRouter';
import listRouter from './api/listRouter';
import insightsRouter from './api/insightsRouter';

const mainRouter = (app: Application) => {
	userRouter(app);
	taskRouter(app);
	subtaskRouter(app);
	listRouter(app);
	insightsRouter(app);
};

export default mainRouter;
