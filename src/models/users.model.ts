import prisma from '../lib/database';
import { doesEmailExist } from './helpers/users.model.helper';
import bcrypt from 'bcrypt';
import User from '../types/User.type';

class Users {
	/** Creates a new user with the provided user's info
	 * @param user {@link User}
	 * @returns the *id* of the created user.
	 *  */
	async signUp(user: User): Promise<number> {
		if (await doesEmailExist(user.u_email)) throw { message: `Email does exist`, statusCode: 304 };

		// Create new account
		const isertedUser = await prisma.user.create({
			data: user,
			select: { u_id: true }
		});
		return isertedUser.u_id;
	}

	/**
	 * @returns The *id* of the user.
	 */
	async signIn(email: string, password: string): Promise<number> {
		const userID = await doesEmailExist(email);
		if (userID === 0) throw { message: `Email doesn't exist`, statusCode: 404 };

		const user = await prisma.user.findFirst({
			where: { u_id: userID },
			select: { u_password: true, u_is_confirmed: true }
		});

		if (!user?.u_is_confirmed) throw { message: `The account is not confirmed`, statusCode: 403 }; // Forbidden

		if (!bcrypt.compareSync(password, user?.u_password as string))
			throw { message: `The password is wrong`, statusCode: 403 }; // Forbidden

		return userID;
	}

	/** Marks user's account as confirmed.
	 * @param userID
	 */
	async confirm(userID: number): Promise<void> {
		await prisma.user.update({
			data: { u_is_confirmed: true },
			where: { u_id: userID }
		});
	}
}

export default Users;
