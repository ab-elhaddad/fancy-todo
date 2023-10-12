import { Request, Response, NextFunction } from 'express';
import Lists from '../models/lists.model';
import List from '../types/List.type';

export const createList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const list: List = req.body;
		list.l_user_id = res.locals.user.id;

		const createdList = await Lists.createList(list);

		res.json({ message: 'List created successfully', list: createdList });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const getLists = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const lists = await Lists.getLists(res.locals.user.id);

		res.json({ message: 'Lists fetched successfully', lists });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { l_id } = req.body;

		await Lists.deleteList(l_id);

		res.json({ message: 'List deleted successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { l_id, t_id } = req.body;

		await Lists.addTask(l_id, t_id);

		res.json({ message: 'Task added to list successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { l_id, t_id } = req.body;

		await Lists.removeTask(l_id, t_id);

		res.json({ message: 'Task removed from list successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};
