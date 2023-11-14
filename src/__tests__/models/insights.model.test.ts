import prisma from '../../lib/database';
import Insights from '../../models/insights.model';

describe('Insights', () => {
  let user: {
    u_id: number;
    u_email: string;
    u_password: string;
    u_name: string;
  };
  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        u_email: 'test@example.com',
        u_password: 'password',
        u_name: 'Test'
      }
    });
  });
  afterEach(async () => {
    await prisma.task.deleteMany({});
    await prisma.list.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe('getTasksInitiatedByMe', () => {
    it('should return the correct insights for a user with tasks', async () => {
      const list1 = await prisma.list.create({
        data: {
          l_title: 'List 1',
          l_user_id: user.u_id
        }
      });

      const list2 = await prisma.list.create({
        data: {
          l_title: 'List 2',
          l_user_id: user.u_id
        }
      });

      const tasks = [
        {
          t_title: 'Task 1',
          t_user_id: user.u_id,
          t_priority: 1,
          t_status: false,
          t_due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        },
        {
          t_title: 'Task 2',
          t_user_id: user.u_id,
          t_priority: 2,
          t_status: true,
          t_due_date: new Date('2022-02-01')
        },
        {
          t_title: 'Task 3',
          t_user_id: user.u_id,
          t_priority: 3,
          t_status: false,
          t_due_date: new Date('2022-03-01')
        }
      ];
      await prisma.task.createMany({
        data: tasks
      });

      const taskId = (
        await prisma.task.findFirst({
          where: {
            t_title: 'Task 1'
          }
        })
      )?.t_id as unknown as number;

      await prisma.task_List.createMany({
        data: [
          {
            tl_list_id: list1.l_id,
            tl_task_id: taskId
          },
          {
            tl_list_id: list1.l_id,
            tl_task_id: taskId + 1
          },
          {
            tl_list_id: list2.l_id,
            tl_task_id: taskId + 2
          }
        ]
      });

      const insights = await Insights.getTasksInitiatedByMe(user.u_id);

      expect(insights.allTasks).toBe(3);
      expect(insights.completedTasks).toBe(1);
      expect(insights.incompleteTasks).toBe(2);
      expect(insights.overdueTasks).toBe(1);
      expect(insights.highPriorityTasks).toBe(1);
      expect(insights.mediumPriorityTasks).toBe(1);
      expect(insights.lowPriorityTasks).toBe(1);
      expect(insights.lists).toContainEqual({ l_title: 'List 1', l_count: 2 });
      expect(insights.lists).toContainEqual({ l_title: 'List 2', l_count: 1 });
    });

    it('should return the correct insights for a user with no tasks', async () => {
      const insights = await Insights.getTasksInitiatedByMe(user.u_id);

      expect(insights.allTasks).toBe(0);
      expect(insights.completedTasks).toBe(0);
      expect(insights.incompleteTasks).toBe(0);
      expect(insights.overdueTasks).toBe(0);
      expect(insights.highPriorityTasks).toBe(0);
      expect(insights.mediumPriorityTasks).toBe(0);
      expect(insights.lowPriorityTasks).toBe(0);
      expect(insights.lists).toEqual([]);
    });
  });
});
