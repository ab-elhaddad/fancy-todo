import express from 'express';
import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

class tasksValidator {
	static create = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			t_title: joi.string(),
			t_description: joi.string(),
			t_due_date: joi.date(),
			t_priority: joi.string().valid('low', 'medium', 'high'),
			t_recurring: joi.object({
				type: joi.string().valid('daily', 'weekly', 'monthly'),
				day:
					req.body.t_recurring?.type === 'monthly'
						? joi.number()
						: req.body.t_recurring?.type === 'weekly'
							? joi.string().valid('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
							: joi.forbidden(),
				end_date: [joi.date(), joi.string()]
			})
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message }); // Bad request
		else next();
	});

	static delete = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			t_id: joi.number()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static update = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			t_title: joi.string(),
			t_description: joi.string(),
			t_due_date: joi.date(),
			t_priority: joi.string().valid('low', 'medium', 'high')
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static getAll = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			t_status: joi.string().valid('true', 'false').optional(),
			sort: joi.string().valid('due', 'created', 'priority').optional()
		});

		const { error } = schema.validate(req.query);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static revStatus = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const { error } = joi.object({
			t_id: joi.number().required()
		}).validate(req.body);

		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static addToMyDay = this.revStatus;

	static search = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			search: joi.string().required(),
			sort: joi.string().valid('due', 'created', 'priority').optional()
		});

		const { error } = schema.validate(req.query);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});
}

export default tasksValidator;
