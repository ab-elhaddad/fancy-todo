import setTaskPriority from '../../helpers/setTaskPriority';
import Task from '../../types/Task.type';

describe('setTaskPriority', () => {
  it('should set task priority to 1 if t_priority is "low"', () => {
    const task = { t_priority: 'low' };
    setTaskPriority(task as Task);
    expect(task.t_priority).toBe(1);
  });

  it('should set task priority to 2 if t_priority is "medium"', () => {
    const task = { t_priority: 'medium' };
    setTaskPriority(task as Task);
    expect(task.t_priority).toBe(2);
  });

  it('should set task priority to 3 if t_priority is "high"', () => {
    const task = { t_priority: 'high' };
    setTaskPriority(task as Task);
    expect(task.t_priority).toBe(3);
  });

  it('should retur null if t_priority is not set', () => {
    const task = {};
    expect(setTaskPriority(task as Task)).toBeUndefined();
  });

  it('should not modify task priority if t_priority is not "low", "medium", or "high"', () => {
    const task = { t_priority: 'urgent' };
    expect(() => setTaskPriority(task as Task)).toThrowError('Invalid priority. Must be "low", "medium", or "high"');
  });
});
