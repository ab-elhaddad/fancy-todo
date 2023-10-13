import prisma from '../../lib/database';
import express, { Request, Response, NextFunction, Router } from 'express';

/**
 * Checks whether there is a stored list with the passed list id and user id.
 */
const checkUserOfList: Router = express.Router();
checkUserOfList.use(async (req: Request, res: Response, next: NextFunction) => {
	const { id: userID } = res.locals.user;
	const listId: (number | undefined) = req.query.l_id || req.body.l_id;
	const found = await prisma.list.findFirst({
		where: {
			l_id: listId,
			l_user_id: userID
		}
	});
	if (found) return next();
	res.status(403).json({ message: "This user doesn't own this list." }); // Forbidden
});

export default checkUserOfList;
