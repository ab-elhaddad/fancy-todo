import express from 'express';
import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

class listsValidator {
  static create = express
    .Router()
    .use((req: Request, res: Response, next: NextFunction) => {
      const schema = joi.object({
        l_title: joi.string().required()
      });

      const { error } = schema.validate(req.body);
      if (error) res.status(400).json({ message: error.details[0].message });
      else next();
    });

  static delete = express
    .Router()
    .use((req: Request, res: Response, next: NextFunction) => {
      const schema = joi.object({
        l_id: joi.number().required(),
        l_user_id: joi.number().optional(),
        l_title: joi.string().optional(),
        l_created_at: joi.date().optional()
      });

      const { error } = schema.validate(req.body);
      if (error) res.status(400).json({ message: error.details[0].message });
      else next();
    });

  static update = express
    .Router()
    .use((req: Request, res: Response, next: NextFunction) => {
      const schema = joi.object({
        l_id: joi.number().required(),
        l_title: joi.string().optional(),
        l_user_id: joi.number().optional(),
        l_created_at: joi.date().optional()
      });

      const { error } = schema.validate(req.body);
      if (error) res.status(400).json({ message: error.details[0].message });
      else next();
    });

  static addTask = express
    .Router()
    .use((req: Request, res: Response, next: NextFunction) => {
      const schema = joi.object({
        l_id: joi.number().required(),
        t_id: joi.number().required()
      });

      const { error } = schema.validate(req.body);
      if (error) res.status(400).json({ message: error.details[0].message });
      else next();
    });

  static removeTask = this.addTask;
}

export default listsValidator;
