import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.TEST_DATABASE_URL
		}
	}
});

beforeAll(async () => { // eslint-disable-line no-undef
	await prisma.$connect();
});

afterAll(async () => { // eslint-disable-line no-undef
	await prisma.$disconnect();
});

export default prisma;
