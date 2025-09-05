const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'server error', error: err.message, stack: err.stack, status: err.status || 500 });
};

// const errorAuth = (err, req, res, next) => {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({ message: 'Invalid token' });
//     } else {
//         next(err);
//     }
// };

module.exports =  errorHandler ;
