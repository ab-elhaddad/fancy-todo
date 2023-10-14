import express from 'express';
import { Request, Response } from 'express';
import mainRouter from './routes/mainRouter';
import { debug } from './lib/debug';
import requestDebug from './middlewares/requestDebug.middleware';

export const app = express();

app.use(requestDebug);

//app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the Fancy To-Do App');
});

mainRouter(app);

app.use((req: Request, res: Response) => {
	res.status(404).send('There is no such endpoint!');
});

export const server = app.listen(3000, () => {
	debug('Server is running');
});
