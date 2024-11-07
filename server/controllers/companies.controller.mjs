/* eslint-disable no-unused-vars */
import { db } from '../db/db.mjs';

/**
 * Validates that the company's query parameter 'type' is 
 * either streaming or cable.
 * Will return a 400 if the type given is invalid.
 */
function validateCompanyQueryParameters(req, res, next) {
  if ('type' in req.query && !isValidType(req.query.type)) {
    const error =  new Error('Not a valid type');
    error.status = 400;
    next(error);
  }
  next();
}

/**
 * Checks whether the type given is valid or not
 * @param {String} type - type input by the user 
 * @returns - boolean representing whether it is a valid type
 */
function isValidType(type) {
  return typeof type !== 'string' || 
    (type.toLowerCase().includes('cable') || type.toLowerCase().includes('streaming'));
}

/**
 * Retrieves the companies given the query parameters 
 * from the database and returns them in JSON format
 * 
 * @returns - JSON representing the companies retrieved, or an error message
 */
async function getCompaniesWithQueryParameters(req, res, next) {
  const type = req.query.type;

  const companies = await db.getFilteredCompanies(type);

  if (!companies) {
    return res.status(202).json({error: 'No companies found!'});
  }

  return res.status(200).json(companies);
}

/**
 * Validates whether the company id parameter is
 * a number
 */
function validateCompanyId(req, res, next) {
  const id = Number(req.params['id']);
  if (!id) {
    const error =  new Error('Id must be an integer');
    error.status = 400;
    next(error);
  }
  next();
}

/**
 * Retrieves the company whose ID matches the given ID
 * Will return a 404 if the company does not exist
 * 
 * @returns - JSON representing the company retrieved, or an error message
 */
async function getCompanyById(req, res, next) {
  try {
    const id = req.params.id;
    const company = await db.getCompanyById(id);
    if (!company) {
      const error = new Error('Company ID not found');
      error.status = 404;
      next(error);
    } else {
      return res.status(200).json(company);
    }
  } catch (error) {
    error.status = 500;
    next(error);
  }
}



export {validateCompanyQueryParameters, getCompaniesWithQueryParameters, 
  getCompanyById, validateCompanyId};