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
  return (typeof type !== 'string' ||
  (type.toLowerCase().includes('cable') || type.toLowerCase().includes('streaming')));
}

async function getCompaniesWithQueryParameters(req, res, next) {
  const type = req.query.type;
  return res.status(200).send();
  // retrieve companies and filter by type if needed
}

function validateCompanyId(req, res, next) {
  const id = Number(req.params['id']);
  if (!id) {
    const error =  new Error('Id must be an integer');
    error.status = 400;
    next(error);
  }
  req.params.number = id;
  next();
}

async function getCompanyById(req, res, next) {
  const id = req.params.id;
  return res.status(200).send();
  // retrieve company by id here
}



export {validateCompanyQueryParameters, getCompaniesWithQueryParameters, 
  getCompanyById, validateCompanyId};