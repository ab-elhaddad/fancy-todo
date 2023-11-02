import tasksValidator from "./tasks.validator";
import usersValidate from "./users.validator"

class Validator {
	static users = usersValidate;
	static tasks = tasksValidator;
}

export default Validator;
