export const globalMiddleware = (req, res, next) => {
  

    console.log();

    console.log('Passed middleware');

    console.log();

  
  next();
};