type User = {
	u_id?: number;
	u_email: string;
	u_name: string;
	u_password: string;
	u_created_at?: Date;
	u_updated_at?: Date;
	u_is_confirmed?: boolean;
};

export default User;
