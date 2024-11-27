import * as functions from "firebase-functions";
import { auth } from "../init";
import * as _decode from "jsonwebtoken";

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
  // functions.logger.info("getUserCredentialsMiddleware activated.");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Authorization header missing or malformed" });
  }

  const jwtToken = authHeader.split(" ")[1];
  // console.log("Validating Token:", jwtToken);

  auth
    .verifyIdToken(jwtToken, true)
    .then((decodedToken) => {
      req.uid = decodedToken.uid;
      req["admin"] = decodedToken.admin;
      req["super-admin"] = decodedToken.superadmin;
      req["coach"] = decodedToken.coach;
      req["player"] = decodedToken.player;
      next();
    })
    .catch((err) => {
      console.error("Token validation failed:", err.message);
      res.status(403).json({ message: "Invalid or revoked token" });
    });
}
