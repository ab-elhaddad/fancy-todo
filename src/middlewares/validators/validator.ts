import tasksValidator from "./tasks.validator";
import usersValidate from "./users.validator"
import subtasksValidator from "./subtask.validator";

class Validator {
	static users = usersValidate;
	static tasks = tasksValidator;
	static subtasks = subtasksValidator;
}

export default Validator;
