import { Application } from 'express';
import { addToMyDay, create, deleteTask, getAll, getDueToday, revStatus, searchTasks, updateTask } from '../../controllers/tasks.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import Validator from '../../middlewares/validators/validator';
import errorHandler from '../../middlewares/errorHandler.middleware';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';
import storeAttachment from '../../middlewares/storeAttachment';

const taskRouter = (app: Application) => {
	app.post('/tasks',
		storeAttachment,
		Validator.tasks.create,
		authenticate,
		create,
		errorHandler);
	app.delete('/tasks',
		Validator.tasks.delete,
		authenticate,
		checkUserOfTask,
		deleteTask,
		errorHandler);
	app.put('/tasks',
		authenticate,
		checkUserOfTask,
		Validator.tasks.update,
		updateTask,
		errorHandler);
	app.get('/tasks',
		authenticate,
		Validator.tasks.getAll,
		getAll,
		errorHandler);
	app.get('/tasks/get-due-today',
		authenticate,
		getDueToday,
		errorHandler);
	app.put('/tasks/rev-status',
		authenticate,
		checkUserOfTask,
		Validator.tasks.revStatus,
		revStatus,
		errorHandler);
	app.put('/tasks/add-to-my-day',
		authenticate,
		checkUserOfTask,
		Validator.tasks.addToMyDay,
		addToMyDay,
		errorHandler);
	app.get('/tasks/search',
		authenticate,
		Validator.tasks.search,
		searchTasks,
		errorHandler);
};

export default taskRouter;
