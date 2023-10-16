type Task = {
	t_id?: number;
	t_title: string;
	t_description?: string;
	t_status?: boolean;
	t_due_date?: Date | string;
	t_created_at?: Date;
	t_user_id: number;
	t_priority?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	t_recurring?: {
		type: string, // daily, weekly, monthly
		day?: string | number,
		end_date: Date | string
	}
} & { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export default Task;
