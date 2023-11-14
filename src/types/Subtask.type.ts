type Subtask = {
  s_id?: number;
  s_title: string;
  s_status?: boolean;
  s_created_at?: Date;
  s_task_id: number;
} & { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export default Subtask;
