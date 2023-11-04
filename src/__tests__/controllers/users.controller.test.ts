/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { app, server } from '../../index';
import Users from '../../models/users.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../configuration/config';
import sendEmail from '../../helpers/sendEmail';
import User from '../../types/User.type';
import cookie from 'cookie';

jest.mock('../../models/users.model');
jest.mock(
	'../../helpers/sendEmail.ts', () => {
		return {
			confirmation: jest.fn((userID: number, userEmail: string) => Promise.resolve()),
			resetPassword: jest.fn((userID: number, userEmail: string) => Promise.resolve())
		}
	}
);

// Mock the errorHandler middleware to not print the error in the console
jest.mock('../../middlewares/errorHandler.middleware.ts', () => (req: Request, res: Response) => {
	const { err } = res.locals;
	return res.status(err.statusCode || 500).json({ message: err.message || err.msg || 'Internal Server Error!' });
});

// Mock authentication middleware
jest.mock('../../middlewares/authenticate.middleware.ts', () => (req: Request, res: Response, next: () => void) => {
	res.locals.user = {
		id: 1, email: 'testuser@example.com', name: 'Test User'
	};
	next();
});

describe('Users Controller', () => {
	afterAll(() => {
		server.close();
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /users/sign-up', () => {
		it('should render the sign-up page', async () => {
			const response = await request(app).get('/users/sign-up');

			expect(response.status).toBe(200);
			expect(response.text).toContain('Sign Up');
			expect(Users.create).toHaveBeenCalledTimes(0);
		});
	});

	describe('POST /users/sign-up', () => {
		it('should create a new user and return a success message', async () => {
			const user = {
				u_name: 'Test User',
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signUp function to return an id
			jest.mocked(Users).create.mockImplementation(() => Promise.resolve(1));

			const response = await request(app).post('/users/sign-up').send(user);

			expect(response.status).toBe(200);
			//expect(response.body.message).toBe('User created successfully. Check your email to confirm your account.');
			expect(Users.create).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the email is already in use', async () => {
			const user = {
				u_name: 'Test User',
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signUp function to throw an error
			jest.mocked(Users).create.mockImplementation(() => {
				throw { message: `The email already exists`, statusCode: 409 };
			});

			const response = await request(app).post('/users/sign-up').send(user);

			expect(response.status).toBe(409);
			expect(response.body.message).toBe('The email already exists');
			expect(Users.create).toHaveBeenCalledTimes(1);
		});
	});

	describe('GET /users/sign-in', () => {
		it('should render the sign-in page', async () => {
			const response = await request(app).get('/users/sign-in');

			expect(response.status).toBe(200);
			expect(response.text).toContain('Sign In');
			expect(Users.signIn).toHaveBeenCalledTimes(0);
		});
	});

	describe('POST /users/sign-in', () => {
		it('should return a token and success message if user credentials are correct', async () => {
			const user = {
				u_email: 'testuser@example.com',
				u_password: 'password'
			};

			// Mock the signIn function to return an id
			jest.mocked(Users).signIn.mockImplementation(() => Promise.resolve({ u_id: 1, u_name: 'Test User' }));

			const response = await request(app).post('/users/sign-in').send(user);

			expect(response.status).toBe(302); // Redirect to /welcome
			expect(response.headers.location).toBe('/welcome');
			expect(response.headers['set-cookie']).toBeDefined();
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

			expect(response.status).toBe(302);
			expect(response.headers.location).toBe('users/sign-in');
			//expect(response.body.Message).toBe('Account confirmed :)');
			expect(Users.confirm).toHaveBeenCalledTimes(1);
			expect(Users.confirm).toHaveBeenCalledWith(1);
		});
	});

	describe('GET /users/sign-out', () => {
		it('should clear the token cookie and redirect to /', async () => {
			const response = await request(app).get('/users/sign-out');

			//expect(response.status).toBe(302);
			expect(response.headers.location).toBe('/');
			expect(cookie.parse(
				String(response.headers['set-cookie'])).token)
				.toEqual('');
		});
	});

	describe('GET /users/forgot-password', () => {
		it('should render the forgot-password page', async () => {
			const response = await request(app).get('/users/forgot-password');

			expect(response.status).toBe(200);
			expect(response.text).toContain('Forgot Password');
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('POST /users/forgot-password', () => {
		it('should send a reset password email and render the check-email page', async () => {
			const user = {
				email: 'testuser@example.com'
			};

			// Mock the getIdByEmail function to return an id
			jest.mocked(Users).getIdByEmail.mockImplementation(() => Promise.resolve(1));

			const response = await request(app).post('/users/forgot-password').send(user);

			expect(response.status).toBe(200);
			expect(response.text).toContain('Check your email');
			expect(Users.getIdByEmail).toHaveBeenCalledTimes(1);
			expect(Users.getIdByEmail).toHaveBeenCalledWith(user.email);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(1);
			expect(sendEmail.resetPassword).toHaveBeenCalledWith(1, user.email);
		});

		it('should return an error if the email is not found', async () => {
			const user = {
				email: 'testuser@example.com'
			};

			// Mock the getIdByEmail function to throw an error
			jest.mocked(Users).getIdByEmail.mockImplementation(() => {
				throw { message: `The email does not exist`, statusCode: 404 };
			});

			const response = await request(app).post('/users/forgot-password').send(user);

			expect(response.status).toBe(404);
			expect(response.body.message).toBe('The email does not exist');
			expect(Users.getIdByEmail).toHaveBeenCalledTimes(1);
			expect(Users.getIdByEmail).toHaveBeenCalledWith(user.email);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('GET /users/reset-password/:token', () => {
		it('should render the reset-password page', async () => {
			const token = jwt.sign({ id: 1, email: 'testuser@example.com', name: 'Test User' }, config.jwtSecretKey);

			const response = await request(app).get(`/users/reset-password/${token}`);

			expect(response.status).toBe(200);
			expect(response.text).toContain('Reset Password');
			expect(Users.updatePassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('POST /users/reset-password/:token', () => {
		it('should update the user password and render a success message', async () => {
			const token = jwt.sign({ id: 1, email: 'testuser@example.com', name: 'Test User' }, config.jwtSecretKey);
			const password = 'newpassword';

			// Mock the updatePassword function
			jest.mocked(Users).updatePassword.mockImplementation(() => Promise.resolve());

			const response = await request(app).post(`/users/reset-password/${token}`).send({ password });

			expect(response.status).toBe(200);
			expect(response.text).toContain('Password changed successfully');
			expect(Users.updatePassword).toHaveBeenCalledTimes(1);
			expect(Users.updatePassword).toHaveBeenCalledWith(1, expect.any(String));
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});

		it('should return an error if the token is invalid', async () => {
			const token = 'invalidtoken';
			const password = 'newpassword';

			const response = await request(app).post(`/users/reset-password/${token}`).send({ password });

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('jwt malformed');
			expect(Users.updatePassword).toHaveBeenCalledTimes(0);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('GET /users/profile', () => {
		it('should return the user profile', async () => {
			const user = {
				u_id: 1,
				u_name: 'Test User',
				u_email: 'testuser@example.com'
			};

			// Mock the getById function to return a user
			jest.mocked(Users).getById.mockImplementation(() => Promise.resolve(user as User));

			const response = await request(app).get('/users/profile');

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User retrieved successfully.');
			expect(response.body.user).toEqual({ u_name: user.u_name, u_email: user.u_email });
			expect(Users.getById).toHaveBeenCalledTimes(1);
		});

		it('should return an error if the user is not found', async () => {
			// Mock the getById function to throw an error
			jest.mocked(Users).getById.mockImplementation(() => {
				throw { message: `User not found`, statusCode: 404 };
			});

			const response = await request(app).get('/users/profile');

			expect(response.status).toBe(404);
			expect(response.body.message).toBe('User not found');
			expect(Users.getById).toHaveBeenCalledTimes(1);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('PUT /users/profile', () => {
		it('should update the user profile', async () => {
			const user = {
				u_id: undefined as unknown as number,
				u_name: 'Test User',
				u_email: 'testuser@example.com'
			};

			// Mock the update function
			jest.mocked(Users).update.mockImplementation(() => Promise.resolve());

			const response = await request(app).put('/users/profile').send(user);

			user.u_id = 1;
			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User updated successfully');
			expect(Users.update).toHaveBeenCalledTimes(1);
			expect(Users.update).toHaveBeenCalledWith(user);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});

		it('should return an error if the user is not found', async () => {
			const user = {
				u_id: undefined as unknown as number,
				u_name: 'Test User',
				u_email: 'testuser@example.com'
			};

			// Mock the update function to throw an error
			jest.mocked(Users).update.mockImplementation(() => {
				throw { message: `User not found`, statusCode: 404 };
			});

			const response = await request(app).put('/users/profile').send(user);

			user.u_id = 1;
			expect(response.status).toBe(404);
			expect(response.body.message).toBe('User not found');
			expect(Users.update).toHaveBeenCalledTimes(1);
			expect(Users.update).toHaveBeenCalledWith(user);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});

	describe('DELETE /users/profile', () => {
		it('should delete the user profile', async () => {
			const response = await request(app).delete('/users/profile');

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User deleted successfully');
			expect(Users.deleteById).toHaveBeenCalledTimes(1);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});

		it('should return an error if the user is not found', async () => {
			// Mock the deleteById function to throw an error
			jest.mocked(Users).deleteById.mockImplementation(() => {
				throw { message: `User not found`, statusCode: 404 };
			});

			const response = await request(app).delete('/users/profile');

			expect(response.status).toBe(404);
			expect(response.body.message).toBe('User not found');
			expect(Users.deleteById).toHaveBeenCalledTimes(1);
			expect(sendEmail.resetPassword).toHaveBeenCalledTimes(0);
		});
	});
});
