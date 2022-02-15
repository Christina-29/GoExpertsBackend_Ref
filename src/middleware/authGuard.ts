import { Request, Response, NextFunction } from "express";
import _ from 'lodash';
import { jwtVerify } from "../utils/jwtService";

/**
 * Middleware to verify JWT in request header
 */
const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string;
  const requestID  = req.params.id;
  if (_.isEmpty(token)) {
    return res.status(401).json({ error: "Please provide token" });
  }
  const isVerified = jwtVerify(token);
  if (isVerified && isVerified.id === requestID ) {
    return next();
  }
  return res.status(401).json({ error: "Invalid token, permission denied." });
};

export default authGuard;
