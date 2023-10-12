import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import { addTask, createList, deleteList, getList, getLists, removeTask, shareList, viewsharedList } from '../../controllers/lists.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';

const listRouter = (app: Application) => {
	app.post('/lists', authenticate, createList, errorHandler);
	app.get('/lists', authenticate, getLists, errorHandler);
	app.get('/lists/:l_id', authenticate, getList, errorHandler);
	app.delete('/lists', authenticate, deleteList, errorHandler);
	app.get('/lists/share/:l_id', authenticate, shareList, errorHandler);
	app.get('/lists/:token', viewsharedList, errorHandler);
	app.post('/lists/add-task', authenticate, addTask, errorHandler);
	app.delete('/lists/remove-task', authenticate, removeTask, errorHandler);
};

export default listRouter;
