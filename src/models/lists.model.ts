import List from "../types/List.type";
import prisma from "../lib/database";

class Lists {
	static async createList(list: List) {
		const createdList = await prisma.list.create({
			data: list
		});
		return createdList;
	}

	static async getLists(l_user_id: number) {
		const lists = await prisma.list.findMany({ where: { l_user_id: l_user_id } });
		return lists;
	}
}

export default Lists;
