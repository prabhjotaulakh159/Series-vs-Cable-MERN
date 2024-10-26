/* eslint-disable no-unused-vars */
import express from 'express';
import seriesRouter from './routers/series.router.mjs';

const app = express();

app.use(express.static('../client/dist'));

app.use('/api', seriesRouter);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  return res.status(error.status).json({ message: error.message });
});

export default app;
