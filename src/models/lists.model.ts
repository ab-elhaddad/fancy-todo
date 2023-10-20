import List from '../types/List.type';
import prisma from '../lib/database';

class Lists {
	static async createList(list: List) {
		const createdList = await prisma.list.create({
			data: list
		});
		return createdList;
	}

	static async getLists(l_user_id: number) {
		const lists = await prisma.list.findMany({
			where: {
				l_user_id: l_user_id
			},
			include: {
				Task_List: {
					select: {
						Task: true
					}
				}
			}
		});
		return lists;
	}

	static async getList(l_id: number) {
		const list = await prisma.list.findFirst({
			where: {
				l_id: l_id
			},
			include: {
				Task_List: {
					select: {
						Task: true
					}
				}
			}
		});
		return list;
	}

	static async deleteList(l_id: number): Promise<void> {
		await prisma.list.delete({
			where: {
				l_id: l_id
			}
		});
	}

	static async update(list: List) {
		await prisma.list.update({
			where: {
				l_id: list.l_id
			},
			data: list
		});
	}

	static async addTask(l_id: number, t_id: number) {
		await prisma.task_List.create({
			data: {
				tl_list_id: l_id,
				tl_task_id: t_id
			}
		});
	}

	static async removeTask(l_id: number, t_id: number) {
		await prisma.task_List.deleteMany({
			where: {
				tl_list_id: l_id,
				tl_task_id: t_id
			}
		});
	}
}

export default Lists;
