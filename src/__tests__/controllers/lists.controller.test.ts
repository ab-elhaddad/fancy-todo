/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { app } from '../../index';
import prisma from '../../lib/database';
import List from '../../types/List.type';
import Lists from '../../models/lists.model';
import { server } from '../../index';
import jwt from 'jsonwebtoken';
import generateListURL from '../../helpers/generateListURL';

jest.mock('../../models/lists.model.ts');

jest.mock('../../middlewares/authenticate.middleware.ts', () => jest.fn((req, res, next) => {
	res.locals.user = { id: 1, email: 'Test@User.com', name: 'Test User' };
	next();
}));

jest.mock('../../middlewares/security/checkUserOfList.middleware.ts', () => jest.fn((req, res, next) => next()));
jest.mock('../../middlewares/security/checkUserOfTask.middleware.ts', () => jest.fn((req, res, next) => next()));
jest.mock('../../helpers/generateListURL.ts');

describe('Lists Controller', () => {
	afterAll(() => {
		server.close();
		jest.resetAllMocks();
	});

	afterEach(async () => {
		jest.clearAllMocks();
		await prisma.list.deleteMany();
	});

	describe('createList', () => {
		it('should create a new list', async () => {
			const list = {
				l_title: 'Test List',
			};

			// Mock the Lists.create method
			jest.mocked(Lists).create.mockImplementation((list: List) => Promise.resolve(list));

			const response = await request(app)
				.post('/lists')
				.send(list);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('List created successfully');
			expect(response.body.list).toBeDefined();
		});

		it('should return an error if the list name is missing', async () => {
			const list = {
			};

			const response = await request(app)
				.post('/lists')
				.send(list);

			expect(response.status).toBe(400);
			expect(response.body.message).toBe("\"l_title\" is required");
		});
	});

	describe('getLists', () => {
		it('should return all lists for the authenticated user', async () => {
			const lists = [
				{ l_title: 'Test List 1' },
				{ l_title: 'Test List 2' },
			];

			// Mock the Lists.getAll method
			jest.mocked(Lists).getAll.mockImplementation((l_user_id: number) => Promise.resolve(lists as List[]));

			const response = await request(app)
				.get('/lists');

			const listsResponse = response.body.lists.map((list: List) => { return { l_title: list.l_title } });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Lists fetched successfully');
			expect(listsResponse).toEqual(lists);
		});

		it('should return an error if an error occurs while fetching the lists', async () => {
			const error = new Error();

			// Mock the Lists.getAll method to throw an error
			jest.mocked(Lists).getAll.mockImplementation((userId: number) => { throw error; });

			const response = await request(app)
				.get('/lists');

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('getList', () => {
		it('should return the requested list', async () => {
			const list = { l_id: 1, l_title: 'Test List' };

			// Mock the Lists.get method
			jest.mocked(Lists).get.mockImplementation((l_id: number) => Promise.resolve(list as List));

			const response = await request(app)
				.get(`/lists/${list.l_id}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('List fetched successfully');
			expect(response.body.list).toEqual(list);
		});

		it('should return an error if the list does not exist', async () => {
			const error = new Error();

			// Mock the Lists.get method to throw an error
			jest.mocked(Lists).get.mockImplementation((l_id: number) => { throw error; });

			const response = await request(app)
				.get('/lists/1');

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('deleteList', () => {
		it('should delete a list', async () => {
			const list = {
				l_id: 1,
				l_title: 'Test List',
			};

			// Mock the Lists.delete method
			jest.mocked(Lists).delete.mockImplementation((l_id: number) => Promise.resolve());

			const response = await request(app)
				.delete('/lists')
				.send(list);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('List deleted successfully');
		});

		it('should return an error if the list does not exist', async () => {
			const error = new Error();

			// Mock the Lists.delete method to throw an error
			jest.mocked(Lists).delete.mockImplementation((l_id: number) => { throw error; });

			const response = await request(app)
				.delete('/lists')
				.send({ l_id: 1 });

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('updateList', () => {
		it('should update a list', async () => {
			const list = {
				l_id: 1,
				l_title: 'Test List',
			};

			// Mock the Lists.update method
			jest.mocked(Lists).update.mockImplementation((list: List) => Promise.resolve());

			const response = await request(app)
				.put('/lists')
				.send(list);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('List updated successfully');
		});

		it('should return an error if the list does not exist', async () => {
			const error = new Error();

			// Mock the Lists.update method to throw an error
			jest.mocked(Lists).update.mockImplementation((list: List) => { throw error; });

			const response = await request(app)
				.put('/lists')
				.send({ l_id: 1, l_title: 'Test List' });

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('shareList', () => {
		it('should generate a URL for the given list ID', async () => {
			// Mock the generateListURL method
			jest.mocked(generateListURL).mockImplementation((l_id: number) => 'http://localhost:3000/lists/token');

			const response = await request(app)
				.get('/lists/share/1');

			expect(generateListURL).toHaveBeenCalledWith(1);
			expect(response.status).toBe(200);
			expect(response.body).toEqual({ message: 'URL generated successfully.', url: 'http://localhost:3000/lists/token' });
		});

		it('should call the next middleware with an error if an error occurs', async () => {
			// Mock the generateListURL method
			jest.mocked(generateListURL).mockImplementation((l_id: number) => { throw new Error() });

			const response = await request(app)
				.get('/lists/share/1');

			expect(generateListURL).toHaveBeenCalledWith(1);
			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('viewsharedList', () => {
		it('should return the requested list', async () => {
			const token = jwt.sign('1', 'secret');
			const list = { l_id: 1, l_title: 'Test List' };

			jest.spyOn(jwt, 'decode').mockReturnValue('1');
			jest.spyOn(Lists, 'get').mockResolvedValue(list as List);

			const response = await request(app).get(`/lists/${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('List fetched successfully');
			expect(response.body.list).toEqual(list);
		});

		it('should return an error if the list does not exist', async () => {
			const token = jwt.sign('1', 'secret');
			const error = new Error();

			jest.spyOn(jwt, 'decode').mockReturnValue('1');
			jest.spyOn(Lists, 'get').mockRejectedValue(error);

			const response = await request(app).get(`/lists/${token}`);

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
		});
	});

	describe('addTask', () => {
		it('should add a task to a list', async () => {
			const listId = 1;
			const taskId = 1;

			// Mock the Lists.addTask method
			jest.spyOn(Lists, 'addTask').mockResolvedValue(undefined);

			const response = await request(app)
				.post('/lists/tasks')
				.send({ l_id: listId, t_id: taskId });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task added to list successfully');
			expect(Lists.addTask).toHaveBeenCalledWith(listId, taskId);
		});

		it('should return an error if the task addition fails', async () => {
			const listId = 1;
			const taskId = 1;
			const error = new Error();

			// Mock the Lists.addTask method to throw an error
			jest.spyOn(Lists, 'addTask').mockRejectedValue(error);

			const response = await request(app)
				.post('/lists/tasks')
				.send({ l_id: listId, t_id: taskId });

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
			expect(Lists.addTask).toHaveBeenCalledWith(listId, taskId);
		});
	});

	describe('removeTask', () => {
		it('should remove a task from a list', async () => {
			const listId = 1;
			const taskId = 1;

			// Mock the Lists.removeTask method
			jest.spyOn(Lists, 'removeTask').mockResolvedValue(undefined);

			const response = await request(app)
				.delete('/lists/tasks')
				.send({ l_id: listId, t_id: taskId });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Task removed from list successfully');
			expect(Lists.removeTask).toHaveBeenCalledWith(listId, taskId);
		});

		it('should return an error if the task removal fails', async () => {
			const listId = 1;
			const taskId = 1;
			const error = new Error();

			// Mock the Lists.removeTask method to throw an error
			jest.spyOn(Lists, 'removeTask').mockRejectedValue(error);

			const response = await request(app)
				.delete('/lists/tasks')
				.send({ l_id: listId, t_id: taskId });

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('Internal Server Error!');
			expect(Lists.removeTask).toHaveBeenCalledWith(listId, taskId);
		});
	});
});
