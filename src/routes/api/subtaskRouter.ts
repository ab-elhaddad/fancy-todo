import { Application } from 'express';
import authenticate from '../../middlewares/authenticate.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';
import { createSubtask, deleteSubtask, revStatus, updateSubtask } from '../../controllers/subtasks.controller';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';
import Validator from '../../middlewares/validators/validator';

const subtaskRouter = (app: Application) => {
  app.route('/subtasks')
    .all(authenticate)
    .post(
      Validator.subtasks.create,
      createSubtask,
    )
    .delete(
      Validator.subtasks.delete,
      checkUserOfTask,
      deleteSubtask
    )
    .put(
      checkUserOfTask,
      Validator.subtasks.update,
      updateSubtask
    )
    .all(errorHandler);

  app.route('/subtasks/rev-status')
    .all(authenticate)
    .put(
      checkUserOfTask,
      Validator.subtasks.revStatus,
      revStatus
    )
    .all(errorHandler);
};

export default subtaskRouter;
