import dotenv from 'dotenv';

dotenv.config();

export const config = {
	saltRounds: Number(process.env.SALT_ROUNDS),
	jwtSecretKey: String(process.env.JWT_SECRET_KEY),
	gmailUser: String(process.env.GMAIL_USER),
	gmailPass: String(process.env.GMAIL_PASS)
};
