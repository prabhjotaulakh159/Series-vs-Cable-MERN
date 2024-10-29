import express from 'express';
import 
{ 
  validateSeriesQueryParameters, 
  getSeriesWithQueryParameters, 
  validateId,
  getSeriesById 
} from '../controllers/series.controller.mjs';

const seriesRouter = express.Router();
// const seriesIdRouter = express.Router({mergeParams: true});

seriesRouter.use('/:id', validateId);
seriesRouter.get('/:id', getSeriesById);

seriesRouter.use('/', validateSeriesQueryParameters);
seriesRouter.get('/', getSeriesWithQueryParameters);

export default seriesRouter;