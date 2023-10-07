import prisma from '../../lib/database';

/**
 * Checks whether the passed email have an account or not.
 * @param email
 * @returns `userId || 0` Returns 0 if the email doesn't exist.
 */
export const doesEmailExist = async (email: string): Promise<number> => {
	const isThere = await prisma.user.findFirst({
		where: {
			u_email: email
		},
		select: {
			u_id: true
		}
	});

	return isThere?.u_id || 0;
};
