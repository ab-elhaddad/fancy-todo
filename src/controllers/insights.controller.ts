import insights from '../models/insights.model';
import { Request, Response, NextFunction } from 'express';

export const getTasksInsights = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: userID } = res.locals.user;
		const tasksInsights = await insights.getTasksInitiatedByMe(userID);
		res.json({ message: 'Tasks insights retrieved successfully.', insights: tasksInsights });
	} catch (err) {
		res.locals.error = err;
		next();
	}
};
