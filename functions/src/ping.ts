// functions/src/ping.ts
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "./auth/auth.middleware";
import * as functions from "firebase-functions";
import { SuccessResponse } from "./models/custom-responses";

export const PingApp = express();

PingApp.use(express.json());
PingApp.use(cors({ origin: true }));
PingApp.use(getUserCredentialsMiddleware);

PingApp.get("/", async (req, res) => {
  functions.logger.debug("Starting ping.");

  const successResponse: SuccessResponse = {
    statusCode: 200,
    message: "Ping! Backend is working!",
    data: "Ping! Backend is working!",
  };
  functions.logger.info(successResponse);
  res.status(200).json(successResponse);
});
