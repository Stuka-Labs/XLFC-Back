import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { db } from "../init";
import { firestore } from "firebase-admin";
import DocumentData = firestore.DocumentData;
import { authIsCoach } from "../utils/auth-verification-util";

export const FetchCoachTeamsApp = express();

FetchCoachTeamsApp.use(bodyParser.json());
FetchCoachTeamsApp.use(cors({ origin: true }));
FetchCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coach's team
FetchCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug("Calling Fetch All Teams Function");

  try {
    if (!(authIsCoach(req))) {
      const message = "Access Denied For Fetch All Teams";
      functions.logger.debug(message);
      res.status(403).json({ message: message });
      return;
    }

    const coachDoc = await db.collection("coaches").doc(req["uid"]).get();

    if (!coachDoc.exists) {
      const message = "Coach document not found.";
      functions.logger.debug(message);
      res.status(404).json({ message: message });
      return;
    }

    const coachData = coachDoc.data();
    const teamIds = coachData?.teamIds || [];

    if (teamIds.length === 0) {
      const message = "No teams found for this coach.";
      functions.logger.debug(message);
      res.status(200).json({ data: [] });
      return;
    }

    const teamsSnapshot = await db
      .collection("teams")
      .where(firestore.FieldPath.documentId(), "in", teamIds)
      .where("active", "==", true)
      .get();

    const results: DocumentData[] = [];
    teamsSnapshot.forEach((team) => {
      const data = team.data();
      if (data) {
        results.push({
          ...data,
          id: team.id,
        });
      }
    });

    res.status(200).json({ data: results });
  } catch (err) {
    const message = "Could not fetch teams.";
    functions.logger.error(message, err);
    res.status(500).json({ message: message });
  }
});
