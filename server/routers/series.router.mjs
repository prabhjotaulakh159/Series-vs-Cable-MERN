import express from 'express';
import 
{ 
  validateSeriesQueryParameters, 
  getSeriesWithQueryParameters, 
  validateId,
  getSeriesById 
} from '../controllers/series.controller.mjs';

const seriesRouter = express.Router();

seriesRouter.use((req, res, next) => {
  res.header('Cache-Control', 'max-age=31536000');
  next();
});

/**
 * @swagger
 * /api/series/{id}:
 *   get:
 *     summary: Retrieve a series by ID
 *     description: Get a specific series by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the series to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Series object
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Series not found
 */
seriesRouter.use('/:id', validateId);
seriesRouter.get('/:id', getSeriesById);


/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Retrieve a list of series
 *     description: Get a list of series, optionally filtered by query parameters.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 1980
 *           maximum: 2024
 *         description: Year of release
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the series
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [cable, streaming]
 *         description: Type of series platform
 *     responses:
 *       200:
 *         description: A list of series
 *       400:
 *         description: Invalid query parameters
 */
seriesRouter.use('/', validateSeriesQueryParameters);
seriesRouter.get('/', getSeriesWithQueryParameters);

export default seriesRouter;