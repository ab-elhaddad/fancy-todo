import { NextFunction, Request, Response } from 'express';
import Tasks from '../models/tasks.model';
import setTaskPriority from './helpers/setTaskPriority';

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const task = req.body;
		task.t_user_id = res.locals.user.id;

		// Setting due date to today 12:00 PM if not set
		if (task.t_due_date) task.t_due_date = new Date(new Date(task.t_due_date).setHours(12));

		// Replacing string priority with number
		setTaskPriority(task);

		const response = await Tasks.create(task);
		res.json({
			message: 'Task created successfully',
			task: response
		});
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { t_id } = req.body;
		await Tasks.delete(t_id);
		res.json({ message: `Task deleted successfully` });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: u_id } = res.locals.user;
		const t_status = req.query.t_status ? req.query.t_status === 'true' : undefined;
		const sort = req.query.sort?.toString();

		const userTasks = await Tasks.getAll(u_id, t_status, sort);
		res.json({ message: 'Tasks returned sucessfully.', tasks: userTasks });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const getDueToday = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: u_id } = res.locals.user;
		const dueTodayTasks = await Tasks.getDueToday(u_id);
		res.json({
			message: 'Tasks returned successfully.',
			tasks: dueTodayTasks
		});
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const revStatus = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { t_id } = req.body;
		await Tasks.revStatus(t_id);

		res.json({ message: `Task status reversed successfully` });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const addToMyDay = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { t_id } = req.body;
		await Tasks.addToMyDay(t_id);
		res.json({ message: 'Task added to my day successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const searchTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: u_id } = res.locals.user;
		const { search } = req.query;
		const tasks = await Tasks.searchTasks(u_id, String(search || ''));
		res.json({ message: 'Tasks returned successfully.', tasks });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};
