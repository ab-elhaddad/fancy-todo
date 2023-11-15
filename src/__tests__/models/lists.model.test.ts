/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../lib/database';
import Lists from '../../models/lists.model';
import List from '../../types/List.type';
import Task from '../../types/Task.type';

describe('Lists', () => {
  let userId: number, userId2: number;
  beforeAll(async () => {
    userId = (
      await prisma.user.create({
        data: {
          u_name: 'Test User',
          u_email: 'Test@User.com',
          u_password: 'password'
        }
      })
    ).u_id;
    userId2 = (
      await prisma.user.create({
        data: {
          u_name: 'Test User 2',
          u_email: 'Test@User2.com',
          u_password: 'password'
        }
      })
    ).u_id;
  });
  afterAll(async () => {
    await prisma.user.deleteMany();
  });
  afterEach(async () => {
    await prisma.task_List.deleteMany();
    await prisma.list.deleteMany();
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await Lists.create(list);

      expect(createdList).toBeDefined();
      expect(createdList.l_id).toBeDefined();
      expect(createdList.l_title).toBe(list.l_title);
      expect(createdList.l_user_id).toBe(list.l_user_id);
    });
  });

  describe('getAll', () => {
    it('should return all lists for a user', async () => {
      const userLists: List[] = [
        {
          l_title: 'List 1',
          l_user_id: userId
        },
        {
          l_title: 'List 2',
          l_user_id: userId
        },
        {
          l_title: 'List 3',
          l_user_id: userId2
        }
      ];

      await prisma.list.createMany({
        data: userLists
      });

      const lists = (await Lists.getAll(userId)).map((list) => {
        return { l_title: list.l_title, l_user_id: list.l_user_id };
      });

      expect(lists).toBeDefined();
      expect(lists.length).toBe(2);
      expect(lists).toContainEqual(userLists[0]);
      expect(lists).toContainEqual(userLists[1]);
    });
  });

  describe('get', () => {
    it('should return a single list with the given ID', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await prisma.list.create({ data: list });

      const foundList = await Lists.get(createdList.l_id);

      expect(foundList).toBeDefined();
      expect(foundList?.l_id).toBe(createdList.l_id);
      expect(foundList?.l_title).toBe(createdList.l_title);
      expect(foundList?.l_user_id).toBe(createdList.l_user_id);
    });

    it('should return null if the list does not exist', async () => {
      const foundList = await Lists.get(123);

      expect(foundList).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a list with the given ID', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await prisma.list.create({ data: list });

      await Lists.delete(createdList.l_id);

      const foundList = await prisma.list.findUnique({
        where: { l_id: createdList.l_id }
      });

      expect(foundList).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing list', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await prisma.list.create({ data: list });

      const updatedList: List = {
        l_id: createdList.l_id,
        l_title: 'New List Name',
        l_user_id: userId2
      };

      await Lists.update(updatedList);

      const foundList = await prisma.list.findUnique({
        where: { l_id: createdList.l_id }
      });

      expect(foundList).toBeDefined();
      expect(foundList?.l_id).toBe(createdList.l_id);
      expect(foundList?.l_title).toBe(updatedList.l_title);
      expect(foundList?.l_user_id).toBe(updatedList.l_user_id);
    });
  });

  describe('addTask', () => {
    it('should add a task to a list', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await prisma.list.create({ data: list });

      const task: Task = {
        t_title: 'Test Task',
        t_user_id: userId
      };

      const createdTask = await prisma.task.create({ data: task });

      await Lists.addTask(createdList.l_id, createdTask.t_id);

      const taskList = (
        (await prisma.$queryRaw`
				SELECT * FROM public."Task_List"
				WHERE tl_list_id = ${createdList.l_id}
				AND tl_task_id = ${createdTask.t_id}`) as any[]
      )[0];

      expect(taskList).toBeDefined();
      expect(taskList?.tl_list_id).toBe(createdList.l_id);
      expect(taskList?.tl_task_id).toBe(createdTask.t_id);
    });
  });

  describe('removeTask', () => {
    it('should remove a task from a list', async () => {
      const list: List = {
        l_title: 'Test List',
        l_user_id: userId
      };

      const createdList = await prisma.list.create({ data: list });

      const task: Task = {
        t_title: 'Test Task',
        t_user_id: userId
      };

      const createdTask = await prisma.task.create({ data: task });

      await prisma.task_List.create({
        data: {
          tl_list_id: createdList.l_id,
          tl_task_id: createdTask.t_id
        }
      });

      await Lists.removeTask(createdList.l_id, createdTask.t_id);

      const taskList = (
        (await prisma.$queryRaw`
				SELECT * FROM public."Task_List"
				WHERE tl_list_id = ${createdList.l_id}
				AND tl_task_id = ${createdTask.t_id}`) as any[]
      )[0];

      expect(taskList).toBeUndefined();
    });
  });
});
