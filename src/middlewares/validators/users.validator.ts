import joi from 'joi';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

class usersValidate {
	static signUp = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			u_email: joi.string().email(),
			u_name: joi.string(),
			u_password: joi.string().min(8),
			u_password_confirm: joi.equal(joi.ref('u_password')).optional()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static signIn = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			u_email: joi.string().email(),
			u_password: joi.string()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static forgotPassword = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			email: joi.string().email()
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static resetPassword = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const bodySchema = joi.object({
			password: joi.string().min(8),
			password_confirm: joi.equal(joi.ref('password')).optional()
		});
		const paramsSchema = joi.object({
			token: joi.string()
		});

		const { error: bodyError } = bodySchema.validate(req.body);
		const { error: paramsError } = paramsSchema.validate(req.params);

		if (bodyError || paramsError)
			res.status(400).json({ message: (bodyError ? bodyError : paramsError)?.details[0].message });
		else next();
	});

	static confirm = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			token: joi.string()
		});

		const { error } = schema.validate(req.params);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});

	static update = express.Router().use((req: Request, res: Response, next: NextFunction) => {
		const schema = joi.object({
			u_email: joi.string().email(),
			u_name: joi.string(),
		});

		const { error } = schema.validate(req.body);
		if (error) res.status(400).json({ message: error.details[0].message });
		else next();
	});
}

export default usersValidate;
