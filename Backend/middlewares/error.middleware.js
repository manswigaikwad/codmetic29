import dotenv from "dotenv";
dotenv.config();

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // If status code is 200, change it to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific errors like MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Return the error response
  res.status(statusCode).json({
    message,
    // Only show stack trace in development mode, useful for debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};




export { notFound, errorHandler };
