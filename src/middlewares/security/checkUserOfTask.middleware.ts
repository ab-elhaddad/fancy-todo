import prisma from '../../lib/database';
import express, { Request, Response, NextFunction, Router } from 'express';

/**
 * Checks whether there is a stored task with the passed task id and user id.
 */
const checkUserOfTask: Router = express.Router();
checkUserOfTask.use(async (req: Request, res: Response, next: NextFunction) => {
  const { id: userID } = res.locals.user;
  const taskID = req.body.t_id | req.body.s_task_id;
  const found = await prisma.task.findFirst({
    where: {
      t_id: taskID,
      t_user_id: userID
    }
  });
  if (found) return next();
  res.status(403).json({ message: "This user doesn't own this task." }); // Forbidden
});

export default checkUserOfTask;
