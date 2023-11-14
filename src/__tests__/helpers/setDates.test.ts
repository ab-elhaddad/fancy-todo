import setDates from '../../helpers/setDates';
import Task from '../../types/Task.type';

describe('setDates', () => {
  it('should set the time of t_due_date to 12:00:00.000', () => {
    const task: Task = {
      t_title: 'Test Task',
      t_user_id: 1,
      t_due_date: new Date('2022-01-01T00:00:00.000Z')
    };
    setDates(task);
    expect((task.t_due_date as Date).getHours()).toBe(12);
    expect((task.t_due_date as Date).getMinutes()).toBe(0);
    expect((task.t_due_date as Date).getSeconds()).toBe(0);
    expect((task.t_due_date as Date).getMilliseconds()).toBe(0);
  });

  it('should set the time of t_recurring.end_date to 12:00:00.000', () => {
    const task: Task = {
      t_title: 'Test Task',
      t_user_id: 1,
      t_recurring: {
        end_date: new Date('2022-01-01T00:00:00.000Z'),
        type: 'daily'
      }
    };
    setDates(task);
    expect((task.t_recurring?.end_date as Date).getHours()).toBe(12);
    expect((task.t_recurring?.end_date as Date).getMinutes()).toBe(0);
    expect((task.t_recurring?.end_date as Date).getSeconds()).toBe(0);
    expect((task.t_recurring?.end_date as Date).getMilliseconds()).toBe(0);
  });
});
