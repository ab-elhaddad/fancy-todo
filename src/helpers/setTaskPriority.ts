import Task from './../types/Task.type';
/**
 * Sets the priority of the task from string to a number.
 */
const setTaskPriority = (task: Task) => {
  if (!task.t_priority) return;
  if (task.t_priority === 'low') task.t_priority = 1;
  else if (task.t_priority === 'medium') task.t_priority = 2;
  else if (task.t_priority === 'high') task.t_priority = 3;
  else throw Error('Invalid priority. Must be "low", "medium", or "high"');
};

export default setTaskPriority;
