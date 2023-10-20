import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import {
	addTask,
	createList,
	deleteList,
	getList,
	getLists,
	removeTask,
	shareList,
	updateList,
	viewsharedList
} from '../../controllers/lists.controller';
import errorHandler from '../../middlewares/errorHandler.middleware';
import checkUserOfList from '../../middlewares/security/checkUserOfList.middleware';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';

const listRouter = (app: Application) => {
	app.post('/lists', authenticate, createList, errorHandler);
	app.get('/lists', authenticate, getLists, errorHandler);
	app.get('/lists/:l_id', authenticate, checkUserOfList, getList, errorHandler);
	app.delete('/lists', authenticate, checkUserOfList, deleteList, errorHandler);
	app.put('/lists', authenticate, checkUserOfList, updateList, errorHandler);
	app.get('/lists/share/:l_id', authenticate, checkUserOfList, shareList, errorHandler);
	app.get('/lists/:token', viewsharedList, errorHandler); // No authentication required (public)
	app.post('/lists/add-task', authenticate, checkUserOfTask, checkUserOfList, addTask, errorHandler);
	app.delete('/lists/remove-task', authenticate, checkUserOfList, removeTask, errorHandler);
};

export default listRouter;
