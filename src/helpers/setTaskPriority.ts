import Task from './../types/Task.type';

const setTaskPriority = (task: Task) => {
	if (task.t_priority) {
		if (task.t_priority === 'low') task.t_priority = 1;
		else if (task.t_priority === 'medium') task.t_priority = 2;
		else if (task.t_priority === 'high') task.t_priority = 3;
	}
};

export default setTaskPriority;
