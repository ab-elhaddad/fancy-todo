import { Application } from 'express';
import { addToMyDay, create, deleteTask, getAll, getDueToday, revStatus, searchTasks, updateTask } from '../../controllers/tasks.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import Validator from '../../middlewares/validators/validator';
import errorHandler from '../../middlewares/errorHandler.middleware';
import checkUserOfTask from '../../middlewares/security/checkUserOfTask.middleware';
import storeAttachment from '../../middlewares/storeAttachment';

const taskRouter = (app: Application) => {
  app.route('/tasks')
    .all(authenticate)
    .post(
      storeAttachment,
      Validator.tasks.create,
      create,
    )
    .delete(
      Validator.tasks.delete,
      checkUserOfTask,
      deleteTask
    )
    .put(
      checkUserOfTask,
      Validator.tasks.update,
      updateTask
    )
    .get(
      Validator.tasks.getAll,
      getAll
    )
    .all(errorHandler);

  app.route('/tasks/get-due-today')
    .all(authenticate)
    .get(getDueToday)
    .all(errorHandler);

  app.route('/tasks/rev-status')
    .all(authenticate)
    .put(
      checkUserOfTask,
      Validator.tasks.revStatus,
      revStatus
    )
    .all(errorHandler);

  app.route('/tasks/add-to-my-day')
    .all(authenticate)
    .put(
      checkUserOfTask,
      Validator.tasks.addToMyDay,
      addToMyDay
    )
    .all(errorHandler);

  app.route('/tasks/search')
    .all(authenticate)
    .get(
      Validator.tasks.search,
      searchTasks
    )
    .all(errorHandler);
};

export default taskRouter;
