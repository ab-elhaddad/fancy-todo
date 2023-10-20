import List from '../types/List.type';
import prisma from '../lib/database';

class Lists {
	static async create(list: List): Promise<List> {
		const createdList: List = await prisma.list.create({
			data: list
		});
		return createdList;
	}

	/**
 * @param l_id Id of the user to return their lists.
 * @returns An array of Lists.
 */
	static async getAll(l_user_id: number): Promise<List[]> {
		const lists: List[] = await prisma.list.findMany({
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

	/**
	 * @param l_id The list Id.
	 * @returns A single list which has the passed id.
	 */
	static async get(l_id: number): Promise<List | null> {
		const list: List | null = await prisma.list.findFirst({
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

	static async delete(l_id: number): Promise<void> {
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
