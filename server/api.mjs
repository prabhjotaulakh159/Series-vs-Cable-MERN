/* eslint-disable no-unused-vars */
import express from 'express';
import seriesRouter from './routers/series.router.mjs';
import companiesRouter from './routers/companies.router.mjs';
import compression from 'compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'LDD Got Moves Like Swagger',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routers/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(compression());

app.use(express.static('../client/dist'));

app.use('/api/companies', companiesRouter);
app.use('/api/series', seriesRouter);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  return res.status(error.status).json({ message: error.message });
});

export default app;
