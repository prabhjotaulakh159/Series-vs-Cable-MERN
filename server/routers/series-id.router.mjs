import express from 'express';
import {validateId, getSeriesById} from '../controllers/series.controller.mjs';

const seriesIdRouter = express.Router({mergeParams: true});

seriesIdRouter.use(validateId);
seriesIdRouter.get('/', getSeriesById);

export default seriesIdRouter;