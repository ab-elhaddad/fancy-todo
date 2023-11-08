import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import { getTasksInsights } from '../../controllers/insights.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';

const insightsRouter = (app: Application) => {
  app.route('/insights/tasks')
    .all(authenticate)
    .get(getTasksInsights)
    .all(errorHandler);
};

export default insightsRouter;
