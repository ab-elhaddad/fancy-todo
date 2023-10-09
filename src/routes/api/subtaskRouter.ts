import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';
import { createSubtask, deleteSubtask, revStatus } from '../../controllers/subtasks.controller';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';

const subtaskRouter = (app: Application) => {
	app.post('/subtasks/create', authenticate, createSubtask, errorHandler);
	app.delete('/subtasks/delete', authenticate, checkUserOfTask, deleteSubtask, errorHandler);
	app.put('/subtasks/rev-complete', authenticate, checkUserOfTask, revStatus, errorHandler);
};

export default subtaskRouter;
