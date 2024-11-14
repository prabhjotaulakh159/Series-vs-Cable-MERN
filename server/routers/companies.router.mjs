import express from 'express';
import {validateCompanyQueryParameters, getCompaniesWithQueryParameters, 
  getCompanyById, validateCompanyId}
  from '../controllers/companies.controller.mjs';

/* /api/companies router */

const companiesRouter = express.Router();


/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve a list of companies
 *     description: Get a list of companies, optionally filtered by type.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [cable, streaming]
 *         description: Type of company platform
 *     responses:
 *       200:
 *         description: A list of companies
 *       400:
 *         description: Invalid type parameter
 */
companiesRouter.use('/', validateCompanyQueryParameters);
companiesRouter.get('/', getCompaniesWithQueryParameters);


/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Retrieve a company by ID
 *     description: Get a specific company by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the company to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company object
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Company not found
 */
companiesRouter.use('/:id', validateCompanyId);
companiesRouter.get('/:id', getCompanyById);

export default companiesRouter;