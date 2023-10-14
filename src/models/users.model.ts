import prisma from '../lib/database';
import bcrypt from 'bcrypt';
import User from '../types/User.type';
import { Prisma } from '@prisma/client';

class Users {
	/** Creates a new user with the provided user's info
	 * @param user {@link User}
	 * @returns the *id* of the created user.
	 *  */
	static async signUp(user: User): Promise<number> {
		// Create new account
		try {
			const isertedUser = await prisma.user.create({
				data: user,
				select: { u_id: true }
			});
			return isertedUser.u_id;
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError)
				if (err?.code === 'P2002') throw { message: `The email already exists`, statusCode: 409 }; // Conflict
			throw err;
		}
	}

	/**
	 * @returns The *id* of the user.
	 */
	static async signIn(email: string, password: string): Promise<number> {
		const user = await prisma.user.findFirst({
			where: { u_email: email },
			select: { u_password: true, u_is_confirmed: true, u_id: true }
		});
		if (user === null) throw { message: `The email doesn't exist`, statusCode: 404 }; // Not Found
		if (!user.u_is_confirmed) throw { message: `The account is not confirmed`, statusCode: 403 }; // Forbidden

		if (!bcrypt.compareSync(password, user?.u_password as string)) throw { message: `The password is wrong`, statusCode: 403 }; // Forbidden

		return user.u_id;
	}

	/**
	 * @returns The *id* of the user.
	 */
	static async getId(email: string): Promise<number> {
		const user = await prisma.user.findFirst({
			where: { u_email: email },
			select: { u_id: true }
		});
		if (user === null) throw { message: `The email doesn't exist`, statusCode: 404 }; // Not Found
		return user.u_id;
	}

	static async get(userID: number): Promise<User> {
		const user = await prisma.user.findFirst({
			where: { u_id: userID }
		});
		if (user === null) throw { message: `The user doesn't exist`, statusCode: 404 }; // Not Found
		return user;
	}

	static async updatePassword(userID: number, newPassword: string): Promise<void> {
		await prisma.user.update({
			where: { u_id: userID },
			data: { u_password: newPassword }
		});
	}

	/** Marks user's account as confirmed.
	 * @param userID
	 */
	static async confirm(userID: number): Promise<void> {
		await prisma.user.update({
			data: { u_is_confirmed: true },
			where: { u_id: userID }
		});
	}
}

export default Users;
