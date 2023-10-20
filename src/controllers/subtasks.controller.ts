import { NextFunction, Request, Response } from 'express';
import Subtasks from '../models/subtasks.model';
import Subtask from '../types/Subtask.type';

export const createSubtask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sentSubtask: Subtask = req.body;
		const createdSubtask = await Subtasks.createSubtask(sentSubtask);
		res.json({ message: 'Sub task created succesfully.', subtask: createdSubtask });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const deleteSubtask = async (req: Request, res: Response, next: NextFunction) => {
	const subtask: Subtask = req.body;
	try {
		await Subtasks.deleteSubtask(subtask);
		res.json({ message: 'Subtask deleted successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const updateSubtask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const subtask: Subtask = req.body;
		await Subtasks.update(subtask);
		res.json({ message: 'Subtask updated successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const revStatus = async (req: Request, res: Response, next: NextFunction) => {
	const subtask: Subtask = req.body;
	try {
		await Subtasks.revStatus(subtask.s_id as number);
		res.json({ message: 'Sub task reversed successfully' });
	} catch (err) {
		res.locals.err = err;
		next();
	}
};
