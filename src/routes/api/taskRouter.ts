import { Application } from 'express';
import { addToMyDay, create, deleteTask, getAll, getDueToday, revStatus, searchTasks, updateTask } from '../../controllers/tasks.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import { createTaskValidator, deleteTaskValidator } from '../../middlewares/validators/tasks.validator';
import errorHandler from '../../middlewares/errorHandler.middleware';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';

const taskRouter = (app: Application) => {
	app.post('/tasks/create', createTaskValidator, authenticate, create, errorHandler);
	app.delete('/tasks/delete', deleteTaskValidator, authenticate, checkUserOfTask, deleteTask, errorHandler);
	app.put('/tasks', authenticate, checkUserOfTask, updateTask, errorHandler);
	app.get('/tasks/get-all', authenticate, getAll, errorHandler);
	app.get('/tasks/get-due-today', authenticate, getDueToday, errorHandler);
	app.put('/tasks/rev-status', authenticate, checkUserOfTask, revStatus, errorHandler);
	app.put('/tasks/add-to-my-day', authenticate, checkUserOfTask, addToMyDay, errorHandler);
	app.get('/tasks/search', authenticate, searchTasks, errorHandler);
};

export default taskRouter;
