import prisma from '../lib/database';
import Subtask from '../types/Subtask.type';
class Subtasks {
	/**
	 * Creates a new sub task.
	 * @param subtask
	 * @returns the created sub task
	 */
	static async createSubtask(subtask: Subtask): Promise<Subtask> {
		const insertedSubtask = await prisma.subtask.create({
			data: subtask
		});
		return insertedSubtask;
	}

	/**
	 * Deletes the sub task with the passed id.
	 * @param id
	 */
	static async deleteSubtask(subtask: Subtask): Promise<void> {
		// Throws an exception if the record isn't found
		await prisma.subtask.delete({
			where: {
				s_id: subtask.s_id,
				s_task_id: subtask.s_task_id
			}
		});
	}

	static async update(subTask: Subtask): Promise<void> {
		await prisma.subtask.update({
			where: {
				s_id: subTask.s_id
			},
			data: subTask
		});
	}

	/**
	 * Reverses the completed column in the sub task's row.
	 * @param id
	 */
	static async revStatus(id: number): Promise<void> {
		const res: Subtask[] = await prisma.$queryRaw`
		UPDATE public."Subtask"
		SET s_status = NOT (
			SELECT s_status
			FROM public."Subtask"
			WHERE s_id = ${id}
		)
		WHERE s_id = ${id}
		RETURNING s_id
		`;
		if (res.length === 0)
			// There is no task with the provided task and subtask id
			throw { message: 'Not Allowed', statusCode: 403 };
	}
}

export default Subtasks;
