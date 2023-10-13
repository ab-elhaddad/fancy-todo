import Users from '../models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { config } from '../configuration/config';
import jwt from 'jsonwebtoken';
import sendConfirmationEmail from '../helpers/sendConfirmationEmail';
import User from '../types/User.type';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: User = req.body;
		user.u_password = bcrypt.hashSync(user.u_password, config.saltRounds);
		const userID = await Users.signUp(user);

		sendConfirmationEmail(userID, user.u_email);
		res.json({
			message: 'User created successfully. Check your email to confirm your account.'
		});
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { u_email, u_password } = req.body;
		const userID = await Users.signIn(u_email, u_password);
		res.json({
			token: jwt.sign({ id: userID, email: u_email }, config.jwtSecretKey),
			message: `User logged in successfully`
		});
	} catch (err) {
		res.locals.err = err;
		next();
	}
};

export const confirm = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { token } = req.params;
		const id = Number(jwt.verify(token, config.jwtSecretKey));
		await Users.confirm(id);
		res.json({ Message: 'Account confirmed :)' });
		//res.redirect('http://localhost:3000/users/login');
	} catch (err) {
		console.error('Error in confirm function in users.controller.');
		res.locals.err = err;
		next();
	}
};
