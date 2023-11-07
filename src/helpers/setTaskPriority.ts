import Task from './../types/Task.type';
/**
 * Sets the priority of the task from string to a number.
 */
const setTaskPriority = (task: Task) => {
  const err = Error('Invalid priority. Must be "low", "medium", or "high"');
  if (!task?.t_priority) throw err;

  if (task.t_priority === 'low') task.t_priority = 1;
  else if (task.t_priority === 'medium') task.t_priority = 2;
  else if (task.t_priority === 'high') task.t_priority = 3;
  else throw err;
};

export default setTaskPriority;
