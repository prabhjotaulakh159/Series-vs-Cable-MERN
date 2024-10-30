/* eslint-disable no-unused-vars */
import { db } from '../db/db.mjs';

function validateCompanyQueryParameters(req, res, next) {
  if ('type' in req.query && !isValidType(req.query.type)) {
    const error =  new Error('Not a valid type');
    error.status = 400;
    next(error);
  }
  next();
}

function isValidType(type) {
  return typeof type !== 'string' || 
    (type.toLowerCase().includes('cable') || type.toLowerCase().includes('streaming'));
}

async function getCompaniesWithQueryParameters(req, res, next) {
  const type = req.query.type;
  // TODO: retrieve companies and filter by type if needed
  
  return res.status(200).send();
}

function validateCompanyId(req, res, next) {
  const id = Number(req.params['id']);
  if (!id) {
    const error =  new Error('Id must be an integer');
    error.status = 400;
    next(error);
  }
  next();
}

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