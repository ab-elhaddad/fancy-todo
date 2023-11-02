import express from 'express';
import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

class subtasksValidator {
	static create = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			s_title: joi.string().required(),
			s_task_id: joi.number().required()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static delete = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			s_id: joi.number().required(),
			s_task_id: joi.number().required(),
			s_status: joi.number().optional(),
			s_created_at: joi.date().optional()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static update = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			s_id: joi.number().optional(),
			s_title: joi.string().required(),
			s_task_id: joi.number().required(),
			s_status: joi.number().optional(),
			s_created_at: joi.date().optional()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static revStatus = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			s_id: joi.number().required(),
			s_task_id: joi.number().required(),
			s_status: joi.number().optional(),
			s_created_at: joi.date().optional(),
			s_title: joi.string().optional()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});
}

export default subtasksValidator;
