import { db } from '../db/db.mjs';

/**
 * Validates the year, name and type query parameters
 */
function validateSeriesQueryParameters(req, res, next) {
  try {
    if ('year' in req.query) {
      validateYear(req.query.year);
    }
    if ('name' in req.query) {
      validateName(req.query.name);
    }
    if ('type' in req.query) {
      validateType(req.query.type);
    }
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

/**
 * Checks if the year is between 1980 and 2024
 * @param { String } year - Year to validate
 * @throws { Error } - If the validation fails
 */
function validateYear(year) {
  const MIN_DATE = 1980;
  const MAX_DATE = 2024;
  if (isNaN(year) || Number(year) < MIN_DATE || Number(year) > MAX_DATE) {
    throw new Error('Year must be between 1980 and 2024');
  } 
}

/**
 * Checks if the name is not empty or blank
 * @param { String } name - Name to validate
 * @throws { Error } - If the validation fails
 */
function validateName(name) {
  if (!name || name?.trim() === '') {
    throw new Error('Name cannot be empty');
  }
}

/**
 * Checks if the type is not empty, blank or not cable or streaming
 * @param { String } type - Type to validate
 * @throws { Error } - If the validation fails
 */
function validateType(type) {
  if (!type || type?.trim() === '' || !['cable', 'streaming'].includes(type)) {
    throw new Error('Type must be either cable or streaming');
  }
}

/**
 * Fetches series from the database depending on the query parameters
 */
async function getSeriesWithQueryParameters(req, res, next) {
  try {
    const series = await db.getFilteredSeries(req.query.name, 
      req.query.year, req.query.type);   
    return res.send(series);
  } catch (error) {
    error.status(500);
    next(error);
  }
}

function validateId(req, res, next){
  try{
    if(isNaN(req.params.id) === true){
      throw new Error(`id must be a number`);
    }
    if(Number(req.params.id) < 0){
      throw new Error('id cannot be less than 0');
    }
    next();
  }catch(error){
    error.status = 400;
    next(error);
  }
}

function getSeriesById(req, res){
  res.status(200);
  res.send({});
}

export {
  validateSeriesQueryParameters,
  getSeriesWithQueryParameters,
  validateId,
  getSeriesById
};
