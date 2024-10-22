import express from 'express';
import * as series from '../controllers/series.controller.mjs';

const router = express.Router();

router.get('/series/:id', series.getSeriesById);

export default router;