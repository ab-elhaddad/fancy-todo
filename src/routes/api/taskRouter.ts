import { Application } from 'express';
import { addToMyDay, create, deleteTask, getAll, getDueToday, revStatus, searchTasks, updateTask } from '../../controllers/tasks.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import { createTaskValidator, deleteTaskValidator } from '../../middlewares/validators/tasks.validator';
import errorHandler from '../../middlewares/errorHandler.middleware';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';
import storeAttachment from '../../middlewares/storeAttachment';

const taskRouter = (app: Application) => {
	app.post('/tasks', storeAttachment, createTaskValidator, authenticate, create, errorHandler);
	app.delete('/tasks', deleteTaskValidator, authenticate, checkUserOfTask, deleteTask, errorHandler);
	app.put('/tasks', authenticate, checkUserOfTask, updateTask, errorHandler);
	app.get('/tasks', authenticate, getAll, errorHandler);
	app.get('/tasks/get-due-today', authenticate, getDueToday, errorHandler);
	app.put('/tasks/rev-status', authenticate, checkUserOfTask, revStatus, errorHandler);
	app.put('/tasks/add-to-my-day', authenticate, checkUserOfTask, addToMyDay, errorHandler);
	app.get('/tasks/search', authenticate, searchTasks, errorHandler);
};

export default taskRouter;
