exports.globalMiddleware = (req, res, next) => {
  if (req.body.cliente) {

    console.log();

    console.log('Passed middleware');

    console.log();

  }
  next();
};