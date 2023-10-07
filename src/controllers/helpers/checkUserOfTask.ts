import prisma from '../../lib/database';
/**
 * Checks whether there is a task with the passed task and user id.
 * @param taskID
 * @param userID
 */
export const checkUserOfTask = async (taskID: number, userID: number): Promise<boolean> => {
	const found = await prisma.task.findFirst({
		where: {
			t_id: taskID,
			t_user_id: userID
		}
	});
	return found !== undefined;
};
