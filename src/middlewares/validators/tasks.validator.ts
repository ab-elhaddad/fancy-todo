import express from 'express';
import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

export const createTaskValidator = express.Router();
createTaskValidator.use((req: Request, res: Response, next: NextFunction) => {
	const schema = joi.object({
		t_title: joi.string(),
		t_description: joi.string(),
		t_due_date: joi.date()
	});

	const { error } = schema.validate(req.body);
	if (error) res.status(400).json({ message: error.details[0].message }); // Bad request
	else next();
});

export const deleteTaskValidator = express.Router();
deleteTaskValidator.use((req: Request, res: Response, next: NextFunction) => {
	const schema = joi.object({
		t_id: joi.number()
	});

	const { error } = schema.validate(req.body);
	if (error) res.json({ message: error.details[0].message }); // Bad request
	else next();
});
