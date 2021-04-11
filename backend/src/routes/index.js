import express from 'express';
import bodyParser from 'body-parser';
import searchRoutes from './searchRoutes';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(searchRoutes);

export default app;
