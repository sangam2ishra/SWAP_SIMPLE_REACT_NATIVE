import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {
  console.log("Verify it");
  const token = req.cookies.access_token;
  if (!token) {
    console.log("no it1");
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("not it2");
      return next(errorHandler(401, 'Unauthorized'));
    }
    console.log("yes it");
    req.user = user;
    next();
  });
};