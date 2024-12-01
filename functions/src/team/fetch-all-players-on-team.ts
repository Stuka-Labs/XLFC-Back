import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { db } from "../init";
import { authIsUser } from "../utils/auth-verification-util";
import { ErrorResponse, SuccessResponse } from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_ALL_PLAYERS_ON_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
  TEAM_CREATION_SUCCESS_MESSAGE,
  TEAM_CREATION_ERROR_MESSAGE,
} from "../constants/error-message";
import { teamExists } from "../utils/manage-team-util";
import { firestore } from "firebase-admin";
import DocumentData = firestore.DocumentData;
import { FETCH_ALL_PLAYERS_ON_TEAM_SUCCESS_MESSAGE } from "../constants/success-message";
import { FieldValue } from "firebase-admin/firestore";

export const FetchPlayersOnTeamApp = express();

FetchPlayersOnTeamApp.use(express.json());
FetchPlayersOnTeamApp.use(cors({ origin: true }));
FetchPlayersOnTeamApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchPlayersOnTeamApp.get("/", async (req, res) => {
  functions.logger.debug("[FetchPlayersOnTeamApp] Fetching all players for team");
  try {
    if (await authIsUser(req)) {
      const teamId = req.query.teamId as string;
      if (!teamId) {
        return res.status(400).json({ message: "teamId is required" });
      }

      const playersSnapshot = await db.collection("players").where("teamId", "==", teamId).get();
      const players = playersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({
        message: "Players fetched successfully",
        data: players,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    functions.logger.error("Error fetching players:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Add a POST route to create a team record
FetchPlayersOnTeamApp.post("/addTeam", async (req, res) => {
  functions.logger.debug("Calling Add Team Record Function");

  try {
    if (await authIsUser(req)) {
      const { teamId, name, description } = req.body;

      const uid = req["uid"];
      if (!teamId || !name) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: "Missing required fields: teamId or name",
        };
        functions.logger.debug(errorResponse);
        return res.status(errorResponse.statusCode).json(errorResponse);
      }

      const teamsSnapshot = await db
        .collection("teams")
        .where("teamId", "==", teamId)
        .get();

      if (teamsSnapshot.size > 0) {
        const teamAlreadyExistResponse: SuccessResponse = {
          statusCode: 200,
          message: "Team already exists, skippping...",
          data: { ...teamsSnapshot.docs[0].data() },
        };
        functions.logger.debug(teamAlreadyExistResponse);
        return res
          .status(teamAlreadyExistResponse.statusCode)
          .json(teamAlreadyExistResponse);
      }

      const teamDocRef = db.collection("teams").doc(uid);
      const teamData = {
        teamId,
        name,
        description: description || "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        active: true,
      };

      await teamDocRef.set(teamData, { merge: true });
      const players: DocumentData[] = [];
      const playersSnapshot = await db
        .collection("players")
        .where("teamId", "==", "xlfc") // Replace "xlfc" with your `teamId` variable if dynamic
        .get();

      if (playersSnapshot.empty) {
        // Insert a new player record since no player exists with teamId === "xlfc"
        const newPlayerData = {
          teamId: "xlfc",
        };

        const playerDocRef = db.collection("players").doc(uid);
        await playerDocRef.set(newPlayerData);
      } else {
        // Push existing players to the array
        playersSnapshot.forEach((player) => {
          players.push({
            ...player.data(),
            id: player.id,
          });
        });
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: TEAM_CREATION_SUCCESS_MESSAGE,
        data: { ...teamData },
      };
      functions.logger.debug(successResponse);
      return res.status(successResponse.statusCode).json(successResponse);
    } else {
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
    }
    return;
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: TEAM_CREATION_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
  return;
});
