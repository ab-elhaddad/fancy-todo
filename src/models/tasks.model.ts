import Task from '../types/Task.type';
import getDates from '../helpers/getDates';
import prisma from '../lib/database';

class Tasks {
  /** Creates a new task assigned to the passed user id.
   * @param task {@link Task}
   * @returns an object of {@link Task}.
   */
  static async create(task: Task): Promise<Task> {
    const insertedTask: Task = await prisma.task.create({
      data: task
    });
    return insertedTask;
  }

  static async createMany(tasks: Task[]): Promise<number> {
    const response = await prisma.task.createMany({
      data: tasks
    });
    return response.count;
  }

  /** Deletes the task with the given id.*/
  static async delete(t_id: number): Promise<void> {
    await prisma.task.delete({
      where: { t_id: t_id }
    });
  }

  static async update(task: Task): Promise<void> {
    await prisma.task.update({
      where: { t_id: task.t_id },
      data: task
    });
  }

  /**
   * Gets all the tasks assigned by the user based on the status.
   * @param u_id
   * @param t_status Determines the status of returned tasks. *If not passed all tasks are returned.*
   * @returns Tasks assigned by the user.
   */
  static async getAll(u_id: number, options?: {
    t_status?: boolean,
    sort?: 'due' | 'created' | 'priority',
    limit?: number,
    page?: number
  }): Promise<Task[]> {
    const { t_status, sort, limit = 10, page = 1 } = options || {};
    const tasks: Task[] = await prisma.task.findMany({
      where: {
        t_user_id: u_id,
        t_status: t_status
      },
      include: {
        t_subtasks: true
      },
      orderBy: {
        t_due_date: sort === 'due' ? 'asc' : undefined,
        t_created_at: sort === 'created' || sort === undefined ? 'desc' : undefined, // Sort by created date by default
        t_priority: sort === 'priority' ? 'desc' : undefined
      },
      take: limit,
      skip: (page - 1) * limit // Skip the previous pages
    });

    return tasks;
  }

  /** Gets all the tasks assigned to the passed user id and has due date today. */
  static async getDueToday(u_id: number, options?: {
    t_status?: boolean,
    sort?: 'due' | 'created' | 'priority',
    limit?: number,
    page?: number
  }): Promise<Task[]> {
    const { t_status, sort, limit = 10, page = 1 } = options || {};
    const { startDate, endDate } = getDates();
    const tasks: Task[] = await prisma.task.findMany({
      where: {
        t_user_id: u_id,
        t_due_date: {
          gte: startDate,
          lte: endDate
        },
        t_status: t_status
      },
      orderBy: {
        t_due_date: sort === 'due' ? 'asc' : undefined,
        t_created_at: sort === 'created' ? 'desc' : undefined,
        t_priority: sort === 'priority' || sort === undefined ? 'desc' : undefined // Sort by priority date by default
      },
      take: limit,
      skip: (page - 1) * limit // Skip the previous pages
    });
    return tasks;
  }

  /** Reverse the completed aolumn in the task's row. */
  static async revStatus(t_id: number): Promise<void> {
    await prisma.$queryRaw`
        UPDATE public."Task"
        SET t_status = NOT (
            SELECT t_status
            FROM public."Task"
            WHERE t_id = ${t_id}
        )
        WHERE t_id = ${t_id}`;
  }

  static async addToMyDay(t_id: number): Promise<void> {
    const now = new Date();
    await prisma.task.update({
      where: { t_id: t_id },
      data: { t_due_date: now }
    });
  }

  static async search(u_id: number, search: string, options?: {
    t_status?: boolean,
    sort?: 'due' | 'created' | 'priority',
    limit?: number,
    page?: number
  }): Promise<Task[]> {
    const { t_status, sort, limit = 10, page = 1 } = options || {};
    const tasks: Task[] = await prisma.task.findMany({
      where: {
        t_user_id: u_id,
        t_title: {
          contains: search,
          mode: 'insensitive'
        },
        t_status: t_status
      },
      orderBy: {
        t_due_date: sort === 'due' ? 'asc' : undefined,
        t_created_at: sort === 'created' || sort === undefined ? 'desc' : undefined, // Sort by created date by default
        t_priority: sort === 'priority' ? 'desc' : undefined
      },
      take: limit,
      skip: (page - 1) * limit // Skip the previous pages
    });
    return tasks;
  }
}

export default Tasks;
