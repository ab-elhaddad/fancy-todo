import { PrismaClient } from '@prisma/client';
import { config } from '../configuration/config';

//const prisma = new PrismaClient({ log: ['query'] });
const prisma = config.env === 'dev' ? new PrismaClient() : new PrismaClient({ datasources: { db: { url: config.testDb } } });
export default prisma;
