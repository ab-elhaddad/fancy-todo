import Task from '../types/Task.type';

function setDates(task: Task) {
	if (task.t_due_date) task.t_due_date = new Date(new Date(task.t_due_date).setHours(12));
	if (task.t_recurring?.end_date) task.t_recurring.end_date = new Date(new Date(task.t_recurring.end_date).setHours(12));
}

export default setDates;
