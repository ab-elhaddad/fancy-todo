import express from 'express';
import { Request, Response } from 'express';

const errorHandler = express.Router();

errorHandler.use((req: Request, res: Response) => {
	const { err } = res.locals;
	console.error(err);
	return res.status(err.statusCode || 500).json({ message: err.message || err.msg || 'Internal Server Error!' });
});

export default errorHandler;
