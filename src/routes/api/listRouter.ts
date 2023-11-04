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
import Validator from '../../middlewares/validators/validator';

const listRouter = (app: Application) => {
	app.post('/lists',
		authenticate,
		Validator.lists.create,
		createList,
		errorHandler);
	app.get('/lists',
		authenticate,
		getLists,
		errorHandler);
	app.get('/lists/:l_id',
		authenticate,
		checkUserOfList,
		getList,
		errorHandler);
	app.delete('/lists',
		authenticate,
		checkUserOfList,
		Validator.lists.delete,
		deleteList,
		errorHandler);
	app.put('/lists',
		authenticate,
		checkUserOfList,
		Validator.lists.update,
		updateList,
		errorHandler);
	app.get('/lists/share/:l_id',
		authenticate,
		checkUserOfList,
		shareList,
		errorHandler);
	app.get('/lists/:token',
		viewsharedList,
		errorHandler); // No authentication required (public)
	app.post('/lists/tasks',
		authenticate,
		checkUserOfTask,
		checkUserOfList,
		Validator.lists.addTask,
		addTask,
		errorHandler);
	app.delete('/lists/tasks',
		authenticate,
		checkUserOfList,
		Validator.lists.removeTask,
		removeTask,
		errorHandler);
};

export default listRouter;
