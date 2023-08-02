import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Get token from the body
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  // Verifying the token to see if it is still valid
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    // Assigning user to the req.user for api calls
    req.user = user;
    // It's gonna continue from where we left i.e. our controller so this next is for that
    next();
  });
};
