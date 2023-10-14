import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/database';
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../configuration/config';

const authenticate = express.Router();

authenticate.use(async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string | undefined = req.headers.authorization?.split(' ')[1] ||
			req.headers.cookie?.slice(6);

		if (token === undefined)
			return res.status(401).json({ message: 'You have to enter a token!' }); // Unauthorized

		try {
			// verifying that the token's schema is valid
			jwt.verify(token, config.jwtSecretKey);
		} catch (e) {
			return res.status(401).json({ message: 'Invalid Token!' }); // Unauthorized
		}

		const user = jwt.decode(token) as JwtPayload;

		if (!(await doesExist(user.id, user.email)))
			// verifying that there is a user matched with the token
			return res.status(401).json({ message: 'Wrong or old token!' });

		res.locals.user = user;
		next();
	} catch (e) {
		console.error('Error in authenticate middleware\n', e);
		return res.json({ message: 'Internal Server Error.' });
	}
});

export default authenticate;

const doesExist = async (id: number, email: string): Promise<boolean> => {
	const storedUser = await prisma.user.findFirst({
		where: {
			u_id: id,
			u_email: email
		},
		select: {
			u_id: true,
			u_email: true
		}
	});
	return storedUser !== null;
};
