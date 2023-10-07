import Subtask from '../../types/Subtask.type';
import { checkTaskOfSubtask } from './checkTaskofSubTask';
import { checkUserOfTask } from './checkUserOfTask';

/**
 * Validates whether the user sending the request owns the task and whther the task owns this sub task.
 * @param subtask an object of {@link Subtask}
 * @param userID
 * @returns Throws an *error* if invaid relation is found.
 */
const validateSubtask = async (subtask: Subtask, userID: number): Promise<void> => {
	const isUser = await checkUserOfTask(subtask.s_task_id, userID);
	const isTask = await checkTaskOfSubtask(subtask);
	if (!isUser || !isTask) throw { message: "Doesn't have the authority!", statusCode: 403 }; // Forbidden
};
export default validateSubtask;
