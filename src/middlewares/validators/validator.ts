import tasksValidator from './tasks.validator';
import usersValidate from './users.validator';
import subtasksValidator from './subtask.validator';
import listsValidator from './list.validator';

class Validator {
  static users = usersValidate;
  static tasks = tasksValidator;
  static subtasks = subtasksValidator;
  static lists = listsValidator;
}

export default Validator;
