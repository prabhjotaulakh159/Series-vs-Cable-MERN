import express from 'express';
import {validateCompanyQueryParameters, getCompaniesWithQueryParameters, 
  getCompanyById, validateCompanyId}
  from '../controllers/companies.controller.mjs';

/* /api/companies router */

const companiesRouter = express.Router();

companiesRouter.use('/', validateCompanyQueryParameters);
companiesRouter.get('/', getCompaniesWithQueryParameters);

companiesRouter.get('/:id', validateCompanyId);
companiesRouter.get('/:id', getCompanyById);

export default companiesRouter;