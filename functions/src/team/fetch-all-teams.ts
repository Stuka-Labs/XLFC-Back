import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;

export const FetchAllTeamsApp = express();

FetchAllTeamsApp.use(bodyParser.json());
FetchAllTeamsApp.use(cors({origin: true}));
FetchAllTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchAllTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Teams Function");
  try {
    if (!req["uid"]) {
      const message = "Access Denied For Fetch All Teams";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const searchQuery = req.query.searchQuery as string;
    if (!searchQuery) {
      const teamsSnapshot = await db
        .collection("teams").where("active", "==", true).get();
      const results: DocumentData[] = [];
      teamsSnapshot.forEach((team) => {
        const data = team.data();
        if (data) {
          results.push(data);
        }
      });
      res.status(200).json({data: results});
    } else {
      const teamsSnapshot = await db
        .collection("teams")
        .orderBy("name")
        .startAt(searchQuery)
        .endAt(searchQuery + "\uf8ff")
        .get();
      const results: DocumentData[] = [];
      teamsSnapshot.forEach((team) => {
        const data: DocumentData = team.data();
        if (data) {
          results.push(data);
        }
      });
      res.status(200).json({data: results});
    }
  } catch (err) {
    const message = "Could not fetch teams.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
