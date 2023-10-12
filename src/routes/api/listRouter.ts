import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import { addTask, createList, deleteList, getLists, removeTask } from '../../controllers/lists.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';

const listRouter = (app: Application) => {
	app.post('/lists', authenticate, createList, errorHandler);
	app.get('/lists', authenticate, getLists, errorHandler);
	app.delete('/lists', authenticate, deleteList, errorHandler);
	app.post('/lists/add-task', authenticate, addTask, errorHandler);
	app.delete('/lists/remove-task', authenticate, removeTask, errorHandler);
};

export default listRouter;
