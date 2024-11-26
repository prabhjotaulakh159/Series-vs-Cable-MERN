import express from 'express';
import 
{ 
  validateSeriesQueryParameters, 
  getSeriesWithQueryParameters, 
  validateId,
  getSeriesById,
  getGenres
} from '../controllers/series.controller.mjs';

const seriesRouter = express.Router();

/**
 * @swagger
 * /api/series/genres:
 *   get:
 *     summary: Retrieve unique genres
 *     description: Get a list of all unique genres across all series.
 *     responses:
 *       200:
 *         description: A list of unique genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of unique genres
 *         examples:
 *           application/json:
 *             value: ["Drama", "Comedy", "Thriller", "Sci-Fi"]
 *       500:
 *         description: Internal server error
 */
seriesRouter.get('/genres', getGenres);


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