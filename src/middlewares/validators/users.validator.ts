import joi from 'joi';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

export const signUpValidator = express.Router();
signUpValidator.use((req: Request, res: Response, next: NextFunction) => {
	const schema = joi.object({
		u_email: joi.string().email(),
		u_name: joi.string(),
		u_password: joi.string().min(8)
	});

	const { error } = schema.validate(req.body);
	if (error) res.status(400).json({ message: error.details[0].message });
	else next();
});

export const signInValidator = express.Router();
signInValidator.use((req: Request, res: Response, next: NextFunction) => {
	const schema = joi.object({
		u_email: joi.string().email(),
		u_password: joi.string()
	});

	const { error } = schema.validate(req.body);
	if (error) res.status(400).json({ message: error.details[0].message });
	else next();
});
