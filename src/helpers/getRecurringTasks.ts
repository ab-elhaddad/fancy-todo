import Task from "../types/Task.type"

const getRecurringTasks = (task: Task): Task[] => {
	let result;
	switch (task.t_recurring?.type) {
		case 'daily':
			result = getDailyTasks(task);
			break;
		case 'weekly':
			result = getWeeklyTasks(task);
			break;
		case 'monthly':
			result = getMonthlyTasks(task);
			break;
		default:
			throw new Error('Invalid recurring type');
	}

	return result;
}

export default getRecurringTasks;

const millisecondsToDays = 1000 * 60 * 60 * 24;

const getDailyTasks = (task: Task): Task[] => {
	const { t_recurring } = task;
	// @ts-ignore
	const { end_date } = t_recurring;

	const startDate = new Date();
	const endDate = new Date(end_date as Date | string);

	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsToDays);
	console.log(days);

	const tasks: Task[] = [];
	delete task.t_recurring;
	for (let i = 0; i < days; i++) {
		const newTask = { ...task };
		newTask.t_due_date = new Date(startDate);
		startDate.setDate(startDate.getDate() + 1);
		tasks.push(newTask);
	}

	return tasks;
}

const getWeeklyTasks = (task: Task): Task[] => {
	const { t_recurring } = task;
	// @ts-ignore
	const { end_date } = t_recurring;

	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const endDate = new Date(end_date);
	const startDate = new Date();

	while (weekday[startDate.getDay()] !== t_recurring?.day) {
		startDate.setDate(startDate.getDate() + 1);
	}

	delete task.t_recurring;
	const tasks: Task[] = [];
	while (startDate <= endDate) {
		const newTask = { ...task };
		newTask.t_due_date = new Date(startDate);
		tasks.push(newTask);
		startDate.setDate(startDate.getDate() + 7);
	}

	return tasks;
}

const getMonthlyTasks = (task: Task): Task[] => {
	const { t_recurring } = task;
	// @ts-ignore
	const { end_date } = t_recurring;

	const startDate = new Date();
	while (startDate.getDate() !== t_recurring?.day)
		startDate.setDate(startDate.getDate() + 1);
	const endDate = new Date(end_date);

	delete task.t_recurring;
	const tasks: Task[] = [];
	while (startDate <= endDate) {
		const newTask = { ...task };
		newTask.t_due_date = new Date(startDate);
		tasks.push(newTask);
		startDate.setMonth(startDate.getMonth() + 1);
	}

	return tasks;
}
