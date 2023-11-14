/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { app, server } from '../../index';
import insights from '../../models/insights.model';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../models/insights.model');
jest.mock(
  '../../middlewares/authenticate.middleware.ts',
  () => (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = { id: 1 };
    next();
  }
);

describe('Insights Controller', () => {
  afterAll(() => {
    server.close();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getTasksInsights', () => {
    it('should return tasks insights for the authenticated user', async () => {
      // Mock the getTasksInitiatedByMe function to return the mock insights
      // @ts-ignore
      jest
        .mocked(insights)
        .getTasksInitiatedByMe.mockImplementation((u_id: number) => Promise.resolve({}));

      // Make a request to the endpoint
      const response = await request(app).get('/insights/tasks').expect(200);

      // Assert that the response contains the expected insights
      expect(insights.getTasksInitiatedByMe).toBeCalledWith(1);
      expect(response.body.insights).toEqual({});
    });

    it('should return an error if there is an issue retrieving tasks insights', async () => {
      // Mock the getTasksInitiatedByMe function to throw an error
      jest.mocked(insights).getTasksInitiatedByMe.mockImplementation((u_id: number) => {
        throw new Error('Error retrieving tasks insights');
      });

      // Make a request to the endpoint
      const response = await request(app).get('/insights/tasks').expect(500);

      // Assert that the response contains the expected error message
      expect(response.body.message).toEqual('Error retrieving tasks insights');
    });
  });
});
