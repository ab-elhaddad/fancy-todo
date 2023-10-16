import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import { getTasksInsights, getWeather } from '../../controllers/insights.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';

const insightsRouter = (app: Application) => {
	app.get('/insights/tasks', authenticate, getTasksInsights, errorHandler);
	app.get('/insights/weather', authenticate, getWeather, errorHandler);
};

export default insightsRouter;
