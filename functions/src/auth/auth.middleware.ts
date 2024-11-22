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
  functions.logger.debug(
    "Attempting to extract user credentials from request."
  );

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    functions.logger.debug("Authorization header missing.");
    return res.status(403).json({ message: "Authorization header missing" });
  }

  // functions.logger.debug(
  //   "[Server]: full authHeader: ",
  //   JSON.stringify(authHeader)
  // );

  const jwtToken = authHeader;
  // console.log('jwtToken: ', jwtToken);
  // try {
  //   const decodedToken = _decode.decode(jwtToken, { complete: true });
  //   console.log("[Server] Decoded Token:", decodedToken);
  // } catch (decodeError) {
  //   console.error("Failed to decode token:", decodeError.message);
  //   return res.status(403).json({ message: "Invalid token structure" });
  // }

  // auth
  //   .verifyIdToken(jwtToken)
  //   .then((jwtPayload) => {
  //     functions.logger.debug("[Server] jwtPayload.uid", jwtPayload.uid);
  //     console.log("JWT Payload:", jwtPayload);
  //     console.log("Issuer:", jwtPayload.iss);
  //     console.log("Audience:", jwtPayload.aud);
  //     req["uid"] = jwtPayload.uid;
  //     req["admin"] = jwtPayload.admin;
  //     req["super-admin"] = jwtPayload.superadmin;
  //     req["coach"] = jwtPayload.coach;
  //     req["player"] = jwtPayload.player;
  //     next();
  //   })
  //   .catch((err) => {
  //     functions.logger.error("Error Occurred When Validating JWT", err.message);
  //     res.status(403).json({ message: "Invalid token" });
  //   });
  auth
    .verifyIdToken(jwtToken)
    .then((jwtPayload) => {
      console.log("[Server] JWT Verified Payload:", jwtPayload);
      console.log("[Server] JWT Issuer:", jwtPayload.iss);
      console.log("[Server] JWT Audience:", jwtPayload.aud);
      req["uid"] = jwtPayload.user_id;
      next();
    })
    .catch((err) => {
      console.error(
        "[Server] JWT Validation Error:",
        JSON.stringify(err),
      );
      res.status(403).json({ message: "Invalid token" });
    });
}
