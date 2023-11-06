import express from 'express';
import { Request, Response } from 'express';
import mainRouter from './routes/mainRouter';
import { debug } from './lib/debug';
import requestDebug from './middlewares/requestDebug.middleware';
import path from 'path';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(requestDebug);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

mainRouter(app);

app.use((req: Request, res: Response) => {
  res.status(404).send('There is no such endpoint!');
});

export const server = app.listen(3000, () => {
  debug('🚀 Server is running');
});
