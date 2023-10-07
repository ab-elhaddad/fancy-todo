import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';
import { createSubtask, deleteSubtask, revStatus } from '../../controllers/subtasks.controller';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';

const subtaskRouter = (app: Application) => {
	app.post('/sub-tasks/create', authenticate, createSubtask, errorHandler);
	app.delete('/sub-tasks/delete', authenticate, checkUserOfTask, deleteSubtask, errorHandler);
	app.put('/sub-tasks/rev-complete', authenticate, checkUserOfTask, revStatus, errorHandler);
};

export default subtaskRouter;
