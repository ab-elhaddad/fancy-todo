import Subtasks from '../../models/subtasks.model';
import prisma from '../../lib/database';
import bcrypt from 'bcrypt';
import Subtask from '../../types/Subtask.type';
import User from '../../types/User.type';
import Task from '../../types/Task.type';
import { config } from '../../configuration/config';

describe('Subtasks', () => {
	let user: User;
	let task: Task;

	beforeAll(async () => {
		user = await prisma.user.create({
			data: {
				u_email: 'test@example.com',
				u_password: bcrypt.hashSync('password', config.saltRounds),
				u_name: 'Test',
			}
		});
		task = await prisma.task.create({
			data: {
				t_user_id: Number(user.u_id),
				t_description: 'Task 1 description',
				t_title: 'Task 1',
			}
		});
	});

	afterAll(async () => {
		await prisma.task.deleteMany({});
		await prisma.user.deleteMany({});
	});

	afterEach(async () => {
		await prisma.subtask.deleteMany({});
	});

	describe('createSubtask', () => {
		it('should create a new subtask', async () => {
			const newSubtask: Subtask = {
				s_task_id: Number(task.t_id),
				s_title: 'Subtask 2',
			};
			const createdSubtask = await Subtasks.createSubtask(newSubtask);
			expect(createdSubtask).toMatchObject(newSubtask);
		});
	});

	describe('deleteSubtask', () => {
		it('should delete an existing subtask', async () => {
			const subtask: Subtask = await prisma.subtask.create({
				data: {
					s_task_id: Number(task.t_id),
					s_title: 'Subtask 2',
				}
			});
			await Subtasks.deleteSubtask(subtask);
			const deletedSubtask = await prisma.subtask.findUnique({
				where: { s_id: subtask.s_id },
			});
			expect(deletedSubtask).toBeNull();
		});
	});

	describe('revStatus', () => {
		it('should reverse the completed status of an existing subtask', async () => {
			const subtask: Subtask = await prisma.subtask.create({
				data: {
					s_task_id: Number(task.t_id),
					s_title: 'Subtask 2',
				}
			});
			await Subtasks.revStatus(Number(subtask.s_id));
			const updatedSubtask = await prisma.subtask.findUnique({
				where: { s_id: subtask.s_id },
			});
			expect(updatedSubtask?.s_status).toBe(!subtask.s_status);
		});

		it('should throw an error if the subtask does not exist', async () => {
			await expect(Subtasks.revStatus(999)).rejects.toEqual({
				message: 'Not Allowed',
				statusCode: 403,
			});
		});
	});
});
