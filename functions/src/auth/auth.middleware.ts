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
  functions.logger.info(
    "getUserCredentialsMiddleware activated."
  );

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Authorization header missing or malformed" });
  }

  // functions.logger.debug(
  //   "[Server]: full authHeader: ",
  //   JSON.stringify(authHeader)
  // );

  // const jwtToken = authHeader;

  //   const decodedToken = _decode.decode(jwtToken, { complete: true });
  //   console.log("[Server] Decoded Token:", decodedToken);
  // } catch (decodeError) {
  //   console.error("Failed to decode token:", decodeError.message);
  //   return res.status(403).json({ message: "Invalid token structure" });
  // }

  const jwtToken = authHeader.split(" ")[1];
  console.log("Validating Token:", jwtToken);

  auth.verifyIdToken(jwtToken, true)
    .then((decodedToken) => {
      console.log("Decoded Token:", decodedToken);
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
  // auth
  //   .verifyIdToken(jwtToken)
  //   .then((jwtPayload) => {
  //     console.log("[Server] JWT Verified Payload:", jwtPayload);
  //     console.log("[Server] JWT Issuer:", jwtPayload.iss);
  //     console.log("[Server] JWT Audience:", jwtPayload.aud);
  //     req["uid"] = jwtPayload.user_id;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.error(
  //       "[Server] JWT Validation Error:",
  //       JSON.stringify(err),
  //     );
  //     res.status(403).json({ message: "Invalid token" });
  //   });
}
