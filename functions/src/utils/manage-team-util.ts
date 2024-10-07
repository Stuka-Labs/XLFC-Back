import {db} from "../init";
import * as functions from "firebase-functions";

export const assignCoachTeam = async (coachId, teamId) => {
  try {
    const teamRef = db.collection("teams").doc(teamId);
    const team = await teamRef.get();
    if (!team.exists) {
      const message = `Could not find a team with the given id: ${teamId}`;
      functions.logger.debug(message);
      return false;
    }
    const coachRef = db.collection("coaches").doc(coachId);
    const coach = await coachRef.get();
    if (!coach.exists) {
      const message = `Could not find a coach with the given id: ${coachId}`;
      functions.logger.debug(message);
      return false;
    }
    const teamIds = coach.data()?.teamIds;
    await db.collection("coaches").doc(coachId).set({
      teamIds: [...teamIds, teamId],
    });
    return true;
  } catch (err) {
    const message = "Error Occurred, Could not assign coach to team";
    functions.logger.error(message, err);
    return false;
  }
};

export const deleteCoachTeam = async (coachId, teamId) => {
  try {
    const teamRef = db.collection("teams").doc(teamId);
    const team = await teamRef.get();
    if (!team.exists) {
      const message = `Could not find a team with the given id: ${teamId}`;
      functions.logger.debug(message);
      return false;
    }
    const coachRef = db.collection("coaches").doc(coachId);
    const coach = await coachRef.get();
    if (!coach.exists) {
      const message = `Could not find a coach with the given id: ${coachId}`;
      functions.logger.debug(message);
      return false;
    }
    const teamIds = coach.data()?.teamIds;
    const index = teamIds.indexOf(teamId, 0);
    if (index > -1) {
      teamIds.splice(index, 1);
    } else {
      const message = "Could not find a team with the given id: " +
        teamId + " assigned to coach with id " + coachId;
      functions.logger.debug(message);
      return false;
    }
    await db.collection("coaches").doc(coachId).set({
      teamIds: [...teamIds],
    });
    return true;
  } catch (err) {
    const message = "Error Occurred, Could not remove coach from team";
    functions.logger.error(message, err);
    return false;
  }
};

export const teamExists = async (teamUid) => {
  const teamRef = db.collection("teams").doc(teamUid);
  const team = await teamRef.get();
  return team.exists;
};

export const playerExists = async (playerUid) => {
  const playerRef = db.collection("players").doc(playerUid);
  const player = await playerRef.get();
  return player.exists;
};

export const coachExists = async (coachUid) => {
  const coachRef = db.collection("coaches").doc(coachUid);
  const coach = await coachRef.get();
  return coach.exists;
};

export const getPlayerByUid = async (uid) => {
  const playerRef = db.collection("players").doc(uid);
  return await playerRef.get();
};
