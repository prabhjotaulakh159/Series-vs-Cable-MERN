function validateSeriesQueryParameters(req, res, next) {
  try {
    if (req.query.year) {
      if (isNaN(req.query.year)) {
        throw new Error('Year must be between 1980 and 2024');
      } 
      const year = Number(req.query.year);
      if (year < 1980 || year > 2024) { 
        throw new Error('Year must be between 1980 and 2024');
      }
      req.year = year;
    }
    if (req.query.name) {
      if (req.query.name.length === 0) {
        throw new Error('Name cannot be empty');
      }
      req.name = req.query.name;
    }
    if (req.query.type) {
      if (req.query.type.length === 0) {
        throw new Error('Type must be either cable or streaming');
      }
      if (!['cable', 'streaming'].includes(req.query.type)) {
        throw new Error('Type must be either cable or streaming');
      }
      req.type = req.query.type;
    }
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

function getSeriesWithQueryParameters(req, res) {
  res.status(200);
  res.send([]);
}

export {
  validateSeriesQueryParameters,
  getSeriesWithQueryParameters
};