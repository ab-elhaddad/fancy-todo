import User from '../../types/User.type';
import prisma from '../../lib/database';
import Users from '../../models/users.model';
import bcrypt from 'bcrypt';
import { config } from '../../configuration/config';

describe('Users', () => {
	afterEach(async () => {
		await prisma.user.deleteMany({});
	});

	describe('signUp', () => {
		it('should create a new user', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: 'password',
				u_name: 'Test'
			};

			const userId = await Users.signUp(user);

			expect(userId).toBeDefined();
			expect(typeof userId).toBe('number');

			const createdUser = await prisma.user.findUnique({
				where: { u_id: userId }
			});

			expect(createdUser).toBeDefined();
			expect(createdUser?.u_email).toBe(user.u_email);
			expect(createdUser?.u_name).toBe(user.u_name);
			expect(createdUser?.u_password).toBeDefined();
			expect(createdUser?.u_is_confirmed).toBe(false);
		});

		it('should throw an error if the email already exists', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			await prisma.user.create({ data: user });

			await expect(Users.signUp(user)).rejects.toEqual({
				message: 'The email already exists',
				statusCode: 409
			});
		});
	});

	describe('signIn', () => {
		it('should sign in a user with correct email and password', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test',
				u_is_confirmed: true
			};

			const createdUser = await prisma.user.create({ data: user });

			const userId = await Users.signIn(user.u_email, 'password');

			expect(userId).toBe(createdUser.u_id);
		});

		it('should throw an error if the account is not confirmed', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			await prisma.user.create({ data: user });

			await expect(Users.signIn(user.u_email, 'password')).rejects.toEqual({
				message: 'The account is not confirmed',
				statusCode: 403
			});
		});

		xit('should throw an error if the email does not exist', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			await expect(await Users.signIn(user.u_email, 'password')).rejects.toEqual({
				message: `The email doesn't exist`,
				statusCode: 404
			});
		});

		it('should throw an error if the password is wrong', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test',
				u_is_confirmed: true
			};

			await prisma.user.create({ data: user });

			await expect(Users.signIn(user.u_email, 'wrong password')).rejects.toEqual({
				message: 'The password is wrong',
				statusCode: 403
			});
		});
	});

	describe('confirm', () => {
		it('should confirm a user account', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_is_confirmed: false,
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			expect(await Users.confirm(createdUser.u_id)).toBeUndefined();
		});
	});
});
