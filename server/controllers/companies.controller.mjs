/* eslint-disable no-unused-vars */
import { db } from '../db/db.mjs';

function validateCompanyQueryParameters(req, res, next) {
  try {
    if ('type' in req.query && !isValidType(req.query.type)) {
      throw new Error('Not a valid type');
    }
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

function isValidType(type) {
  return (typeof type !== 'string' ||
  (type.toLowerCase().includes('cable') || type.toLowerCase().includes('streaming')));
}

async function getCompaniesWithQueryParameters(req, res, next) {
  const type = req.query.type;
  return res.status(200).send();
  // retrieve companies and filter by type if needed
}

function validateCompanyId(req, res, next) {
  try {
    const id = Number(req.params['id']);
    if (!id) {
      throw new Error('Id must be an integer');
    }
    req.params.number = id;
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

async function getCompanyById(req, res, next) {
  const id = req.params.id;
  return res.status(200).send();
  // retrieve company by id here
}



export {validateCompanyQueryParameters, getCompaniesWithQueryParameters, 
  getCompanyById, validateCompanyId};