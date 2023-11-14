import prisma from '../lib/database';

class insights {
  /**
   * Returns an object containing insights about the user's tasks.
   * @param u_id
   * @returns an object containing insights about the user's tasks.
   */
  static async getTasksInitiatedByMe(u_id: number) {
    const insights = {
      allTasks: await prisma.task.count({
        where: {
          t_user_id: u_id
        }
      }),
      completedTasks: await prisma.task.count({
        where: {
          t_user_id: u_id,
          t_status: true
        }
      }),
      incompleteTasks: -1,
      overdueTasks: await prisma.task.count({
        where: {
          t_user_id: u_id,
          t_status: false,
          t_due_date: { lt: new Date() }
        }
      }),
      highPriorityTasks: await prisma.task.count({
        where: {
          t_user_id: u_id,
          t_priority: 3
        }
      }),
      mediumPriorityTasks: await prisma.task.count({
        where: {
          t_user_id: u_id,
          t_priority: 2
        }
      }),
      lowPriorityTasks: await prisma.task.count({
        where: {
          t_user_id: u_id,
          t_priority: 1
        }
      }),
      lists: (
        await prisma.list.findMany({
          where: { l_user_id: u_id },
          select: {
            l_title: true,
            _count: { select: { Task_List: true } }
          }
        })
      ).map((list) => {
        // @ts-ignore
        list.l_count = list._count.Task_List;
        // @ts-ignore
        delete list._count;
        return list;
      })
    };
    insights.incompleteTasks = insights.allTasks - insights.completedTasks;
    return insights;
  }
}

export default insights;
