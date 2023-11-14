import { NextFunction, Request, Response } from 'express';
import Tasks from '../models/tasks.model';
import setTaskPriority from '../helpers/setTaskPriority';
import getRecurringTasks from '../helpers/getRecurringTasks';
import setDates from '../helpers/setDates';
import Task from '../types/Task.type';
import uploadFile from '../helpers/uploadFile';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = req.body;
    task.t_user_id = res.locals.user.id;

    if (req.file) task.t_attachment = await uploadFile(req.file.path);

    // Convert date string to Date object
    setDates(task);

    // Replacing string priority with number
    setTaskPriority(task);

    if (task.t_recurring)
      // If task is recurring, insert the task multipe times
      await Tasks.createMany(getRecurringTasks(task));
    else await Tasks.create(task);

    res.json({
      message: 'Task created successfully'
    });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { t_id } = req.body;
    await Tasks.delete(t_id);
    res.json({ message: `Task deleted successfully` });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task: Task = req.body;
    await Tasks.update(task);
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: u_id } = res.locals.user;
    const { t_status, page, limit, sort } = req.query;

    const userTasks = await Tasks.getAll(u_id, {
      limit: limit as number | undefined,
      page: page as number | undefined,
      sort: sort as 'due' | 'created' | 'priority' | undefined,
      t_status: t_status // If t_status is passed
        ? t_status === 'true' // Convert it to boolean
        : undefined // Else undefined
    });
    res.json({ message: 'Tasks returned sucessfully.', tasks: userTasks });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const getDueToday = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: u_id } = res.locals.user;
    const { t_status, page, limit, sort } = req.query;
    const dueTodayTasks = await Tasks.getDueToday(u_id, {
      limit: limit as number | undefined,
      page: page as number | undefined,
      sort: sort as 'due' | 'created' | 'priority' | undefined,
      t_status: t_status // If t_status is passed
        ? t_status === 'true' // Convert it to boolean
        : undefined // Else undefined
    });
    res.json({
      message: 'Tasks returned successfully.',
      tasks: dueTodayTasks
    });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const revStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { t_id } = req.body;
    await Tasks.revStatus(t_id);

    res.json({ message: `Task status reversed successfully` });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const addToMyDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { t_id } = req.body;
    await Tasks.addToMyDay(t_id);
    res.json({ message: 'Task added to my day successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const searchTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: u_id } = res.locals.user;
    const { search = '' } = req.query;
    const { t_status, sort, page, limit } = req.body;

    const tasks = await Tasks.search(u_id, String(search), {
      sort: sort as 'due' | 'created' | 'priority' | undefined,
      page: page as number | undefined,
      limit: limit as number | undefined,
      t_status: t_status // If t_status is passed
        ? t_status === 'true' // Convert it to boolean
        : undefined // Else undefined
    });
    res.json({ message: 'Tasks returned successfully.', tasks });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};
