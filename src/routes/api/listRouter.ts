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
  app
    .route('/lists')
    .all(authenticate)
    .post(Validator.lists.create, createList)
    .delete(Validator.lists.delete, checkUserOfList, deleteList)
    .put(checkUserOfList, Validator.lists.update, updateList)
    .get(getLists)
    .all(errorHandler);

  app
    .route('/lists/tasks')
    .all(authenticate)
    .post(checkUserOfTask, checkUserOfList, Validator.lists.addTask, addTask)
    .delete(checkUserOfList, Validator.lists.removeTask, removeTask)
    .all(errorHandler);

  app
    .route('/lists/:l_id')
    .all(authenticate)
    .get(checkUserOfList, getList)
    .all(errorHandler);

  app
    .route('/lists/share/:l_id')
    .all(authenticate)
    .get(checkUserOfList, shareList)
    .all(errorHandler);

  app
    .route('/lists/shared/:token')
    .get(viewsharedList) // No authentication required (public)
    .all(errorHandler);
};

export default listRouter;
