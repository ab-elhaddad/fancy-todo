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
  static async getAll(
    l_user_id: number,
    options?: {
      page?: number;
      limit?: number;
    }
  ): Promise<List[]> {
    const { page = 1, limit = 10 } = options || {};
    const lists: List[] = await prisma.list.findMany({
      where: {
        l_user_id: l_user_id
      },
      skip: (page - 1) * limit,
      take: limit,
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
  static async get(
    l_id: number,
    options?: {
      page?: number;
      limit?: number;
      sort?: 'due' | 'created' | 'priority';
      t_status?: boolean;
    }
  ): Promise<List | null> {
    const { page = 1, limit = 10, sort, t_status } = options || {};
    const list: List | null = await prisma.list.findFirst({
      where: {
        l_id: l_id
      },
      include: {
        Task_List: {
          select: {
            Task: true
          },
          where: {
            Task: {
              t_status: t_status
            }
          },
          orderBy: {
            Task: {
              t_due_date: sort === 'due' ? 'asc' : undefined,
              t_created_at: sort === 'created' || sort === undefined ? 'desc' : undefined, // Sort by created date by default
              t_priority: sort === 'priority' ? 'desc' : undefined
            }
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit
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
