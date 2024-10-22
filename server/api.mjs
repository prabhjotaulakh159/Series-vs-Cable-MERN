import express from 'express';

const app = express();

app.use(express.static('../client/dist'));

app.use((req, res) => {
  return res.status(400).json({ error: 'Not found' });
});

export default app;
