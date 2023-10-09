import request from 'supertest';
import { app, server } from '../../index';
import Tasks from '../../models/tasks.model';
import Task from '../../types/Task.type';
import { NextFunction, Request, Response } from 'express';

jest.mock('../../models/tasks.model.ts');
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
jest.mock('../../middlewares/errorHandler.middleware.ts', () => (req: Request, res: Response) => {
	const { err } = res.locals;
	return res
		.status(err.statusCode || 500)
		.json({ message: err.message || err.msg || 'Internal Server Error!' });
});

describe('Tasks Controller', () => {
	afterAll(() => {
		server.close();
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /tasks/create', () => {
		it('should create a new task without due date and return a success message', async () => {
			const task = {
				t_title: 'Task 1',
				t_description: 'Test note'
			};

			// Mock the create function to return an id
			jest.mocked(Tasks).create.mockImplementation((task: Task) => Promise.resolve(task));

			const response = await request(app).post('/tasks/create').send(task);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task created successfully');
			expect(Tasks.create).toHaveBeenCalledTimes(1);
		});

		it('should create a new task with due date and return a success message', async () => {
			const task = {
				t_title: 'Task 1',
				t_description: 'Test note',
				t_due_date: '2023-10-10'
			};

			// Mock the create function to return an id
			jest.mocked(Tasks).create.mockImplementation((task: Task) => Promise.resolve(task));

			const response = await request(app).post('/tasks/create').send(task);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task created successfully');
			expect(response.body.task.t_due_date).toEqual('2023-10-10T09:00:00.000Z');
			expect(Tasks.create).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the task name is not provided', async () => {
			const task = {
				t_title: 'Task 1',
				t_due_date: '2020-01-01',
				t_description: 'Test note'
			};

			// Mock the create function to throw an error
			jest.mocked(Tasks).create.mockImplementation(() => {
				throw { message: `Task name is required`, statusCode: 400 };
			});

			const response = await request(app).post('/tasks/create').send(task);

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Task name is required');
			expect(Tasks.create).toHaveBeenCalledTimes(1);
		});
	});

	describe('DELETE /tasks/delete', () => {
		it('should delete a task and return a success message', async () => {
			const task = {
				t_id: 1
			};

			// Mock the delete function to return an id
			jest.mocked(Tasks).delete.mockImplementation((t_id: number) => Promise.resolve());

			const response = await request(app).delete('/tasks/delete').send(task);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task deleted successfully');
			expect(Tasks.delete).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the task id is not provided', async () => {
			const task = {};

			// Mock the delete function to throw an error
			jest.mocked(Tasks).delete.mockImplementation(() => {
				throw { message: `Task id is required`, statusCode: 400 };
			});

			const response = await request(app).delete('/tasks/delete').send(task);

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Task id is required');
			expect(Tasks.delete).toHaveBeenCalledTimes(1);
		});
	});

	describe('GET /tasks/get-all', () => {
		it('should return all the tasks of the user', async () => {
			const tasks: Task[] = [
				{
					t_id: 1,
					t_title: 'Task 1',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: false,
					t_due_date: '2020-01-01'
				},
				{
					t_id: 2,
					t_title: 'Task 2',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: false,
					t_due_date: '2020-01-01'
				}
			];

			// Mock the getAll function to return an id
			jest
				.mocked(Tasks)
				.getAll.mockImplementation((u_id: number, t_status?: boolean) => Promise.resolve(tasks));

			const response = await request(app).get('/tasks/get-all');

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Tasks returned sucessfully.');
			expect(response.body.tasks).toEqual(tasks);
			expect(Tasks.getAll).toHaveBeenCalledTimes(1);
		});

		it('should return all the completed tasks of the user', async () => {
			const tasks: Task[] = [
				{
					t_id: 1,
					t_title: 'Task 1',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: true,
					t_due_date: '2020-01-01'
				},
				{
					t_id: 2,
					t_title: 'Task 2',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: true,
					t_due_date: '2020-01-01'
				}
			];

			// Mock the getAll function to return an id
			jest
				.mocked(Tasks)
				.getAll.mockImplementation((u_id: number, t_status?: boolean) => Promise.resolve(tasks));

			const response = await request(app).get('/tasks/get-all').query({ t_status: true });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Tasks returned sucessfully.');
			expect(response.body.tasks).toEqual(tasks);
			expect(Tasks.getAll).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the user id is not provided', async () => {
			// Mock the getAll function to throw an error
			jest.mocked(Tasks).getAll.mockImplementation(() => {
				throw { message: `User id is required`, statusCode: 400 };
			});

			const response = await request(app).get('/tasks/get-all');

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('User id is required');
			expect(Tasks.getAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('GET /tasks/get-due-today', () => {
		it('should return all the tasks due today of the user', async () => {
			const tasks: Task[] = [
				{
					t_id: 1,
					t_title: 'Task 1',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: false,
					t_due_date: String(new Date())
				},
				{
					t_id: 2,
					t_title: 'Task 2',
					t_description: 'Test note',
					t_user_id: 1,
					t_status: false,
					t_due_date: String(new Date())
				}
			];

			// Mock the getDueToday function to return an id
			jest.mocked(Tasks).getDueToday.mockImplementation((u_id: number) => Promise.resolve(tasks));

			const response = await request(app).get('/tasks/get-due-today');

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Tasks returned successfully.');
			expect(response.body.tasks).toEqual(tasks);
			expect(Tasks.getDueToday).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the user id is not provided', async () => {
			// Mock the getDueToday function to throw an error
			jest.mocked(Tasks).getDueToday.mockImplementation(() => {
				throw { message: `User id is required`, statusCode: 400 };
			});

			const response = await request(app).get('/tasks/get-due-today');

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('User id is required');
			expect(Tasks.getDueToday).toHaveBeenCalledTimes(1);
		});
	});

	describe('PUT /tasks/rev-status', () => {
		it('should return a success message', async () => {
			const task = {
				t_id: 1
			};

			// Mock the revStatus function to return an id
			jest.mocked(Tasks).revStatus.mockImplementation((t_id: number) => Promise.resolve());

			const response = await request(app).put('/tasks/rev-status').send(task);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task status reversed successfully');
			expect(Tasks.revStatus).toHaveBeenCalledTimes(1);
			expect(Tasks.revStatus).toHaveBeenCalledWith(task.t_id);
		});

		it('should return an error if the task id is not provided', async () => {
			const task = {};

			// Mock the revStatus function to throw an error
			jest.mocked(Tasks).revStatus.mockImplementation(() => {
				throw { message: `Task id is required`, statusCode: 400 };
			});

			const response = await request(app).put('/tasks/rev-status').send(task);

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Task id is required');
			expect(Tasks.revStatus).toHaveBeenCalledTimes(1);
		});
	});

	describe('PUT /tasks/add-to-my-day', () => {
		it('should return a success message', async () => {
			const task = {
				t_id: 1
			};

			// Mock the addToMyDay function to return an id
			jest.mocked(Tasks).addToMyDay.mockImplementation((t_id: number) => Promise.resolve());

			const response = await request(app).put('/tasks/add-to-my-day').send(task);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task added to my day successfully');
			expect(Tasks.addToMyDay).toHaveBeenCalledTimes(1);
			expect(Tasks.addToMyDay).toHaveBeenCalledWith(task.t_id);
		});

		it('should return an error if the task id is not provided', async () => {
			const task = {};

			// Mock the addToMyDay function to throw an error
			jest.mocked(Tasks).addToMyDay.mockImplementation(() => {
				throw { message: `Task id is required`, statusCode: 400 };
			});

			const response = await request(app).put('/tasks/add-to-my-day').send(task);

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Task id is required');
			expect(Tasks.addToMyDay).toHaveBeenCalledTimes(1);
		});
	});
});
