import express, { Request, Response, NextFunction } from 'express';
import { debug } from '../lib/debug';

/**
 * Middleware that logs every request to the console.
 */
const requestDebug = express.Router();

requestDebug.use((req: Request, res: Response, next: NextFunction) => {
	debug(`Request: ${req.method} ${req.url}`);
	next();
});

export default requestDebug;
