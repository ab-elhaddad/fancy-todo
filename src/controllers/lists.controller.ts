import { Request, Response, NextFunction } from 'express';
import Lists from '../models/lists.model';
import List from '../types/List.type';
import generateListURL from '../helpers/generateListURL';
import jwt from 'jsonwebtoken';

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list: List = req.body;
    list.l_user_id = res.locals.user.id;

    const createdList = await Lists.create(list);

    res.json({ message: 'List created successfully', list: createdList });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const getLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const lists = await Lists.getAll(res.locals.user.id, {
      page: page as number | undefined,
      limit: limit as number | undefined
    });

    res.json({ message: 'Lists fetched successfully', lists });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { l_id } = req.params;
    const { page, limit, sort, t_status } = req.query;
    const list = await Lists.get(Number(l_id), {
      page: page as number | undefined,
      limit: limit as number | undefined,
      sort: sort as 'due' | 'created' | 'priority',
      t_status: t_status ? // If t_status is passed
        t_status === 'true' : // Convert it to boolean
        undefined // Else undefined
    });

    res.json({ message: 'List fetched successfully', list });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { l_id } = req.body;

    await Lists.delete(l_id);

    res.json({ message: 'List deleted successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list: List = req.body;

    await Lists.update(list);

    res.json({ message: 'List updated successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const shareList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { l_id } = req.params;

    const url = generateListURL(Number(l_id));
    res.json({ message: 'URL generated successfully.', url });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const viewsharedList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const l_id = Number(jwt.decode(String(token)));

    const list = await Lists.get(l_id);

    res.json({ message: 'List fetched successfully', list });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { l_id, t_id } = req.body;

    await Lists.addTask(l_id, t_id);

    res.json({ message: 'Task added to list successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { l_id, t_id } = req.body;

    await Lists.removeTask(l_id, t_id);

    res.json({ message: 'Task removed from list successfully' });
  } catch (err) {
    res.locals.err = err;
    next();
  }
};
