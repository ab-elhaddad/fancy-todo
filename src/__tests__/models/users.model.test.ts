import User from '../../types/User.type';
import prisma from '../../lib/database';
import Users from '../../models/users.model';
import bcrypt from 'bcrypt';
import { config } from '../../configuration/config';

describe('Users', () => {
	afterEach(async () => {
		await prisma.user.deleteMany({});
	});

	describe('create', () => {
		it('should create a new user', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: 'password',
				u_name: 'Test'
			};

			const userId = await Users.create(user);

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

			await expect(Users.create(user)).rejects.toEqual({
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

			const userId = (await Users.signIn(user.u_email, 'password')).u_id;

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
				message: 'Wrong Email or Password!',
				statusCode: 403
			});
		});

		it('should throw an error if the email does not exist', async () => {
			const user: User = {
				u_email: 'wrong@email.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			await expect(Users.signIn(user.u_email, 'password')).rejects.toEqual({
				message: `Wrong Email or Password!`,
				statusCode: 403
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
				message: 'Wrong Email or Password!',
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

	describe('getIdByEmail', () => {
		it('should return the user id for a valid email', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			const userId = await Users.getIdByEmail(user.u_email);

			expect(userId).toBe(createdUser.u_id);
		});

		it('should throw an error if the email does not exist', async () => {
			await expect(Users.getIdByEmail('nonexistent@example.com')).rejects.toEqual({
				message: `The email doesn't exist`,
				statusCode: 404
			});
		});
	});

	describe('getById', () => {
		it('should return a user with the given ID', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_is_confirmed: true,
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			const foundUser = await Users.getById(createdUser.u_id);

			expect(foundUser).toBeDefined();
			expect(foundUser.u_id).toBe(createdUser.u_id);
			expect(foundUser.u_email).toBe(createdUser.u_email);
			expect(foundUser.u_name).toBe(createdUser.u_name);
			expect(foundUser.u_password).toBe(createdUser.u_password);
			expect(foundUser.u_is_confirmed).toBe(createdUser.u_is_confirmed);
		});

		it('should throw an error if the user does not exist', async () => {
			await expect(Users.getById(123)).rejects.toEqual({
				message: `The user doesn't exist`,
				statusCode: 404
			});
		});
	});

	describe('updatePassword', () => {
		it('should update the password of an existing user', async () => {
			const user = {
				u_email: 'test@example.com',
				u_password: 'oldpassword',
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			const newPassword = 'newpassword';

			await Users.updatePassword(createdUser.u_id, newPassword);

			const updatedUser = await prisma.user.findUnique({
				where: { u_id: createdUser.u_id }
			});

			expect(updatedUser?.u_password).not.toBe(user.u_password);
			expect(updatedUser?.u_password).toBe(newPassword);
		});

		it('should throw an error if the user does not exist', async () => {
			await expect(Users.updatePassword(123, 'newpassword')).rejects.toThrow();
		});
	});

	describe('update', () => {
		it('should update an existing user', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			const updatedUser: User = {
				u_id: createdUser.u_id,
				u_email: 'newemail@example.com',
				u_password: bcrypt.hashSync('newpassword', config.saltRounds),
				u_name: 'New Name'
			};

			await Users.update(updatedUser);

			const foundUser = await prisma.user.findUnique({
				where: { u_id: createdUser.u_id }
			});

			expect(foundUser).toBeDefined();
			expect(foundUser?.u_id).toBe(createdUser.u_id);
			expect(foundUser?.u_email).toBe(updatedUser.u_email);
			expect(foundUser?.u_name).toBe(updatedUser.u_name);
			expect(foundUser?.u_password).toBe(updatedUser.u_password);
		});
	});

	describe('deleteById', () => {
		it('should delete an existing user', async () => {
			const user: User = {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test'
			};

			const createdUser = await prisma.user.create({ data: user });

			await Users.deleteById(createdUser.u_id);

			const foundUser = await prisma.user.findUnique({
				where: { u_id: createdUser.u_id }
			});

			expect(foundUser).toBeNull();
		});
	});
});
