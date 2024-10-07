import * as functions from "firebase-functions";
import {auth} from "../init";

/**
 * Middleware to extract user credentials from the request by verifying
 * the JWT token. If the token is valid, it adds `uid` and `admin`
 * properties to the request object. If no token is provided or if the
 * verification fails, it proceeds to the next middleware.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - Callback to move to the next middleware.
 *
 * @return {void}
 */
export function getUserCredentialsMiddleware(req, res, next) {
  functions.logger.debug(
    "Attempting to extract user credentials from request.");

  const jwt = req.headers.authorization;

  if (jwt) {
    auth.verifyIdToken(jwt)
      .then((jwtPayload) => {
        req["uid"] = jwtPayload.uid;
        req["admin"] = jwtPayload.admin;
        next();
      })
      .catch((err) => {
        functions.logger.error("Error Occurred When Validating JWT", err);
        next();
      });
  } else {
    next();
  }
}
