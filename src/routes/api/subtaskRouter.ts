import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';
import { createSubtask, deleteSubtask, revStatus, updateSubtask } from '../../controllers/subtasks.controller';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';
import Validator from '../../middlewares/validators/validator';

const subtaskRouter = (app: Application) => {
	app.post('/subtasks',
		authenticate,
		Validator.subtasks.create,
		createSubtask,
		errorHandler);
	app.delete('/subtasks',
		authenticate,
		checkUserOfTask,
		Validator.subtasks.delete,
		deleteSubtask,
		errorHandler);
	app.put('/subtasks',
		authenticate,
		Validator.subtasks.update,
		updateSubtask,
		errorHandler);
	app.put('/subtasks/rev-status',
		authenticate,
		checkUserOfTask,
		Validator.subtasks.revStatus,
		revStatus,
		errorHandler);
};

export default subtaskRouter;
