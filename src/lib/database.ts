import { PrismaClient } from '@prisma/client';
import { config } from '../configuration/config';

//const prisma = new PrismaClient({ log: ['query'] });
const prisma =
  config.env === 'dev'
    ? new PrismaClient()
    : new PrismaClient({ datasources: { db: { url: config.testDb } } });
prisma
  .$connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('Error connecting to database', err));
export default prisma;
