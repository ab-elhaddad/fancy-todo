import dotenv from 'dotenv';

dotenv.config();

export const config = {
	saltRounds: Number(process.env.SALT_ROUNDS),
	jwtSecretKey: String(process.env.JWT_SECRET_KEY),
	gmailUser: String(process.env.GMAIL_USER),
	gmailPass: String(process.env.GMAIL_PASS),
	env: String(process.env.ENV),
	db: String(process.env.DATABASE_URL),
	testDb: String(process.env.TEST_DATABASE_URL),
	weatherApiKey: String(process.env.WEATHER_API_KEY),
	baseUrl: String(process.env.BASE_URL),
	storage: {
		accountName: String(process.env.STORAGE_ACCOUNT_NAME),
		containerName: String(process.env.STORAGE_CONTAINER_NAME),
		sasToken: String(process.env.STORAGE_SAS_TOKEN),
		connectionString: String(process.env.ACCOUNT_CONNECTION_STRING),
		blob: {
			sasToken: String(process.env.BLOB_SAS_TOKEN),
		}
	}
};
