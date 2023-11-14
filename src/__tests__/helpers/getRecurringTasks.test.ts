import Task from '../../types/Task.type';
import getRecurringTasks from '../../helpers/getRecurringTasks';
import {
  getDailyTasks,
  getWeeklyTasks,
  getMonthlyTasks
} from '../../helpers/getRecurringTasks';

describe('getRecurringTasks', () => {
  it('should return an empty array if the end date is before the current date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'daily',
        end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      t_user_id: 1
    };

    const tasks = getRecurringTasks(task);

    expect(tasks).toHaveLength(0);
  });

  it('should throw an error if the recurring type is invalid', () => {
    const task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'invalid',
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      t_user_id: 1
    };

    expect(() => getRecurringTasks(task as Task)).toThrow('Invalid recurring type');
  });
});

describe('getDailyTasks', () => {
  let originalDate: Date;
  beforeAll(() => {
    originalDate = new Date();
  });
  it('should return an array of tasks for each day between the start and end date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(originalDate),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'daily',
        end_date: new Date(originalDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      t_user_id: 1
    };
    console.log(task.t_due_date, task.t_recurring?.end_date);

    const tasks = getDailyTasks(task);

    expect(tasks).toHaveLength(7);

    tasks.forEach((task) => {
      expect(task.t_id).toBe(1);
      expect(task.t_title).toBe('Test Task');
      expect(task.t_priority).toBe('low');
      expect(task.t_description).toBe('Test notes');
      expect(task.t_recurring).toBeUndefined();
    });
  });

  it('should return an empty array if the end date is before the current date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'daily',
        end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      t_user_id: 1
    };

    const tasks = getDailyTasks(task);

    expect(tasks).toHaveLength(0);
  });

  it('should remove the recurring property from the original task', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'daily',
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      t_user_id: 1
    };

    getDailyTasks(task);

    expect(task.t_recurring).toBeUndefined();
  });
});

describe('getWeeklyTasks', () => {
  let originalDate: Date;
  beforeAll(() => {
    originalDate = new Date();
  });
  it('should return an array of tasks for each week between the start and end date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(originalDate),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'weekly',
        day: 'Monday',
        end_date: new Date(originalDate.getTime() + 28 * 24 * 60 * 60 * 1000) // 28 days from now
      },
      t_user_id: 1
    };
    console.log(task.t_due_date, task.t_recurring?.end_date);

    const tasks = getWeeklyTasks(task);

    expect(tasks).toHaveLength(4);

    tasks.forEach((task) => {
      expect(task.t_id).toBe(1);
      expect(task.t_title).toBe('Test Task');
      expect(task.t_priority).toBe('low');
      expect(task.t_description).toBe('Test notes');
      expect(task.t_recurring).toBeUndefined();
    });
  });

  it('should return an empty array if the end date is before the current date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'weekly',
        day: 'Monday',
        end_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) // 28 days ago
      },
      t_user_id: 1
    };

    const tasks = getWeeklyTasks(task);

    expect(tasks).toHaveLength(0);
  });

  it('should remove the recurring property from the original task', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'weekly',
        day: 'Monday',
        end_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days from now
      },
      t_user_id: 1
    };

    getWeeklyTasks(task);

    expect(task.t_recurring).toBeUndefined();
  });
});

describe('getMonthlyTasks', () => {
  let originalDate: Date;
  beforeAll(() => {
    originalDate = new Date();
  });
  it('should return an array of tasks for each month between the start and end date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(originalDate),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'monthly',
        day: 15,
        end_date: new Date(originalDate.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      t_user_id: 1
    };

    const tasks = getMonthlyTasks(task);

    expect(tasks).toHaveLength(3);

    tasks.forEach((task) => {
      expect(task.t_id).toBe(1);
      expect(task.t_title).toBe('Test Task');
      expect(task.t_priority).toBe('low');
      expect(task.t_description).toBe('Test notes');
      expect(task.t_recurring).toBeUndefined();
    });
  });

  it('should return an empty array if the end date is before the current date', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'monthly',
        day: 15,
        end_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      },
      t_user_id: 1
    };

    const tasks = getMonthlyTasks(task);

    expect(tasks).toHaveLength(0);
  });

  it('should remove the recurring property from the original task', () => {
    const task: Task = {
      t_id: 1,
      t_title: 'Test Task',
      t_due_date: new Date(),
      t_priority: 'low',
      t_description: 'Test notes',
      t_recurring: {
        type: 'monthly',
        day: 15,
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      t_user_id: 1
    };

    getMonthlyTasks(task);

    expect(task.t_recurring).toBeUndefined();
  });
});
