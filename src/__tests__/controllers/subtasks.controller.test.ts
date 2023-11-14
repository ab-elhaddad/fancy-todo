/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { app, server } from '../../index';
import { Request, Response, NextFunction } from 'express';
import Subtask from '../../types/Subtask.type';
import Subtasks from '../../models/subtasks.model';

jest.mock('../../models/subtasks.model.ts');

jest.mock(
  '../../middlewares/authenticate.middleware.ts',
  () => (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = { id: 1 };
    next();
  }
);

jest.mock(
  '../../middlewares/security/checkUserOfTask.middleware.ts',
  () => (req: Request, res: Response, next: NextFunction) => {
    next();
  }
);

// Mock the errorHandler middleware to not print the error in the console
jest.mock(
  '../../middlewares/errorHandler.middleware.ts',
  () => (req: Request, res: Response) => {
    const { err } = res.locals;
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || err.msg || 'Internal Server Error!' });
  }
);

describe('Subtasks Controller', () => {
  afterAll(async () => {
    server.close();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('createSubtask', () => {
    it('should create a new subtask and return seccess message', async () => {
      const sentSubtask = {
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      // Mock the create function to return s subtask object
      jest
        .mocked(Subtasks)
        .create.mockImplementation((subtask: Subtask) =>
          Promise.resolve({ ...subtask, s_id: 1, s_status: false })
        );

      const response = await request(app).post('/subtasks').send(sentSubtask).expect(200);

      expect(response.body.message).toEqual('Sub task created succesfully.');
      expect(response.body.subtask.s_title).toEqual(sentSubtask.s_title);
      expect(response.body.subtask.s_status).toEqual(false);
      expect(response.body.subtask.s_task_id).toEqual(sentSubtask.s_task_id);
      expect(response.body.subtask.s_id).toEqual(1);
      expect(Subtasks.create).toHaveBeenCalledTimes(1);
      expect(Subtasks.create).toHaveBeenCalledWith(sentSubtask);
    });

    it('should return an error if the subtask could not be created', async () => {
      const sentSubtask: Subtask = {
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest.mocked(Subtasks).create.mockImplementation((subtask: Subtask) =>
        Promise.reject({
          message: 'Could not create subtask',
          stausCode: 500
        })
      );

      const response = await request(app).post('/subtasks').send(sentSubtask).expect(500);

      expect(response.body.message).toEqual('Could not create subtask');
    });
  });

  describe('deleteSubtask', () => {
    it('should delete an existing subtask and return a success message', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest
        .mocked(Subtasks)
        .delete.mockImplementation((subtask: Subtask) => Promise.resolve());

      const response = await request(app).delete('/subtasks').send(subtask);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Subtask deleted successfully');
      expect(Subtasks.delete).toHaveBeenCalledTimes(1);
      expect(Subtasks.delete).toHaveBeenCalledWith(subtask);
    });

    it('should return an error if the subtask could not be deleted', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest.mocked(Subtasks).delete.mockImplementation((subtask: Subtask) =>
        Promise.reject({
          message: 'Could not delete subtask',
          statusCode: 500
        })
      );

      const response = await request(app).delete('/subtasks').send(subtask);

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual('Could not delete subtask');
    });
  });

  describe('updateSubtask', () => {
    it('should update an existing subtask and return a success message', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest
        .mocked(Subtasks)
        .update.mockImplementation((subtask: Subtask) => Promise.resolve());

      const response = await request(app).put('/subtasks').send(subtask).expect(200);

      expect(response.body.message).toEqual('Subtask updated successfully');
      expect(Subtasks.update).toHaveBeenCalledTimes(1);
      expect(Subtasks.update).toHaveBeenCalledWith(subtask);
    });

    it('should return an error if the subtask could not be updated', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest.mocked(Subtasks).update.mockImplementation((subtask: Subtask) =>
        Promise.reject({
          message: 'Could not update subtask',
          statusCode: 500
        })
      );

      const response = await request(app).put('/subtasks').send(subtask);

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual('Could not update subtask');
    });
  });

  describe('revStatus', () => {
    it('should reverse the status of an existing subtask and return a success message', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest
        .mocked(Subtasks)
        .revStatus.mockImplementation((id: number) => Promise.resolve());

      const response = await request(app)
        .put('/subtasks/rev-status')
        .send(subtask)
        .expect(200);

      expect(response.body.message).toEqual('Sub task reversed successfully');
      expect(Subtasks.revStatus).toHaveBeenCalledTimes(1);
      expect(Subtasks.revStatus).toHaveBeenCalledWith(subtask.s_id);
    });

    it('should return an error if the subtask could not be reversed', async () => {
      const subtask: Subtask = {
        s_id: 1,
        s_title: 'Test Subtask',
        s_task_id: 1
      };

      jest.mocked(Subtasks).revStatus.mockImplementation((id: number) =>
        Promise.reject({
          message: 'Could not reverse subtask',
          statusCode: 500
        })
      );

      const response = await request(app)
        .put('/subtasks/rev-status')
        .send(subtask)
        .expect(500);

      expect(response.body.message).toEqual('Could not reverse subtask');
    });
  });
});
