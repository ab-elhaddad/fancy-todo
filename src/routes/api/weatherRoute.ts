import { Application } from 'express';
import { getWeather } from '../../controllers/weather.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';
import authenticate from '../../middlewares/authenticate.middleware';

const weatherRouter = (app: Application) => {
  app.route('/weather').all(authenticate).get(getWeather).all(errorHandler);
};

export default weatherRouter;
