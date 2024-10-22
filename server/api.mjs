import express from 'express';

const app = express();

app.use(express.static('../client/dist'));

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  return res.status(error.status).json({ message: error.message });
});

export default app;
