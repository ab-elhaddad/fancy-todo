import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import mainRouter from './routes/mainRouter';

export const app = express();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the Fancy To-Do App');
});

mainRouter(app);

app.use((req: Request, res: Response) => {
	res.status(404).send('There is no such endpoint!');
});

export const server = app.listen(3000, () => {
	console.log('Server is running');
});
