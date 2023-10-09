import request from 'supertest';
import { app, server } from '../../index';
import Users from '../../models/users.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../configuration/config';

jest.mock('../../models/users.model');
jest.mock(
	'../../controllers/helpers/sendConfirmationEmail',
	() => (userID: number, userEmail: string) => {} // eslint-disable-line @typescript-eslint/no-unused-vars
);

// Mock the errorHandler middleware to not print the error in the console
jest.mock('../../middlewares/errorHandler.middleware.ts', () => (req: Request, res: Response) => {
	const { err } = res.locals;
	return res.status(err.statusCode || 500).json({ message: err.message || err.msg || 'Internal Server Error!' });
});

describe('Users Controller', () => {
	afterAll(() => {
		server.close();
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /users/sign-up', () => {
		it('should create a new user and return a success message', async () => {
			const user = {
				u_name: 'Test User',
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signUp function to return an id
			jest.mocked(Users).signUp.mockImplementation(() => Promise.resolve(1));

			const response = await request(app).post('/users/sign-up').send(user);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User created successfully. Check your email to confirm your account.');
			expect(Users.signUp).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the email is already in use', async () => {
			const user = {
				u_name: 'Test User',
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signUp function to throw an error
			jest.mocked(Users).signUp.mockImplementation(() => {
				throw { message: `The email already exists`, statusCode: 409 };
			});

			const response = await request(app).post('/users/sign-up').send(user);

			expect(response.status).toBe(409);
			expect(response.body.message).toBe('The email already exists');
			expect(Users.signUp).toHaveBeenCalledTimes(1);
		});
	});

	describe('POST /users/sign-in', () => {
		it('should return a token and success message if user credentials are correct', async () => {
			const user = {
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signIn function to return an id
			jest.mocked(Users).signIn.mockImplementation(() => Promise.resolve(1));

			const response = await request(app).post('/users/sign-in').send(user);

			expect(response.status).toBe(200);
			expect(response.body.token).toBeDefined();
			expect(response.body.message).toBe('User logged in successfully');
			expect(Users.signIn).toHaveBeenCalledTimes(1);
		});

		it('should return an error if user credentials are incorrect', async () => {
			const user = {
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signIn function to throw an error
			jest.mocked(Users).signIn.mockImplementation(() => {
				throw { message: `Invalid email or password`, statusCode: 401 };
			});

			const response = await request(app).post('/users/sign-in').send(user);

			expect(response.status).toBe(401);
			expect(response.body.message).toBe('Invalid email or password');
			expect(Users.signIn).toHaveBeenCalledTimes(1);
		});
	});

	describe('GET /users/confirm/:token', () => {
		it('should confirm the user account and return a success message', async () => {
			const token = jwt.sign('1', config.jwtSecretKey);

			// Mock the confirm function
			jest.mocked(Users).confirm.mockImplementation(() => Promise.resolve());

			const response = await request(app).get(`/confirm/${token}`);

			expect(response.status).toBe(200);
			expect(response.body.Message).toBe('Account confirmed :)');
			expect(Users.confirm).toHaveBeenCalledTimes(1);
			expect(Users.confirm).toHaveBeenCalledWith(1);
		});
	});
});
