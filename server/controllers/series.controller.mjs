function validateSeriesQueryParameters(req, res, next) {
  try {
    if ('year' in req.query) {
      validateYear(req.query.year);
      req.year = req.query.year;
    }
    if ('name' in req.query) {
      validateName(req.query.name);
      req.name = req.query.name;
    }
    if ('type' in req.query) {
      validateType(req.query.type);
      req.type = req.query.type;
    }
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

function validateYear(year) {
  if (isNaN(year) || Number(year) < 1980 || Number(year) > 2024) {
    throw new Error('Year must be between 1980 and 2024');
  } 
}

function validateName(name) {
  if (!name || name?.trim() === '') {
    throw new Error('Name cannot be empty');
  }
}

function validateType(type) {
  if (!type || type?.trim() === '' || !['cable', 'streaming'].includes(type)) {
    throw new Error('Type must be either cable or streaming');
  }
}

function getSeriesWithQueryParameters(req, res) {
  res.status(200);
  res.send([]);
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
