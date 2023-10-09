import express, { Request, Response, NextFunction } from 'express';
import { debug } from '../lib/debug';

const requestDebug = express.Router();

requestDebug.use((req: Request, res: Response, next: NextFunction) => {
	debug(`Request: ${req.method} ${req.url}`);
	next();
});


export default requestDebug;
