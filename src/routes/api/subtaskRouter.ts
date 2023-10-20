import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';
import { createSubtask, deleteSubtask, revStatus, updateSubtask } from '../../controllers/subtasks.controller';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';

const subtaskRouter = (app: Application) => {
	app.post('/subtasks/create', authenticate, createSubtask, errorHandler);
	app.delete('/subtasks/delete', authenticate, checkUserOfTask, deleteSubtask, errorHandler);
	app.put('/subtasks', authenticate, updateSubtask, errorHandler);
	app.put('/subtasks/rev-status', authenticate, checkUserOfTask, revStatus, errorHandler);
};

export default subtaskRouter;
