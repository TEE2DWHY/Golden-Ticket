import cors from 'cors';
import express from 'express';
import { CLIENT_URL, MONGODB_URL, PORT } from './constants/constants';
import connect from './db/connect';
import errorHandler from './middlewares/errorHandler';
import notFound from './middlewares/notFound';
import routes from './routes/index';

const app = express();

app.use(
	cors({
		origin: CLIENT_URL,
	}),
);
app.use(express.json());
app.use(routes);
app.use(errorHandler);
app.use(notFound);

app.listen(PORT, async () => {
	await connect(MONGODB_URL);
	console.log(`server is running on port: ${PORT}`);
});
