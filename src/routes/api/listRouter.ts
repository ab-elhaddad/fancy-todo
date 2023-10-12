import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import { createList, getLists } from '../../controllers/lists.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';

const listRouter = (app: Application) => {
	app.post('/lists', authenticate, createList, errorHandler);
	app.get('/lists', authenticate, getLists, errorHandler);
};

export default listRouter;
