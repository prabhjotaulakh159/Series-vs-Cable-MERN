import express from 'express';
import { validateSeriesQueryParameters, getSeriesWithQueryParameters } 
  from '../controllers/series.controller.mjs';

const seriesRouter = express.Router();

seriesRouter.use(validateSeriesQueryParameters);

seriesRouter.get('/', getSeriesWithQueryParameters);

export default seriesRouter;