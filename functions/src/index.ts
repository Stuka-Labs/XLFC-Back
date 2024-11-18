/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import {createAdminApp} from "./admin/create-admin";
import {createUserApp} from "./user/create-user";
import {assignCoachApp} from "./coach/assign-coach";
import {assignCoachTeamApp} from "./coach/assign-coach-team";
import {assignPlayerTeamApp} from "./player/assign-player-team";
import {becomeCoachApp} from "./user/become-coach";
import {becomePlayerApp} from "./user/become-player";
import {SaveWeighInDataApp} from "./weigh-in/save-weigh-in-data";
import {
  FetchWeighInDataForLoggedInUserApp,
} from "./weigh-in/fetch-weigh-in-data-for-logged-in-user";
import {
  FetchWeighInDataForGivenTeamApp,
} from "./weigh-in/fetch-weigh-in-data-for-given-team";
import {
  FetchWeighInDataForGivenPlayerOnCoachTeamsApp,
} from "./weigh-in/fetch-weigh-in-data-for-given-player-on-coach-teams";
import {
  FetchWeighInDataForCoachTeamsApp,
} from "./weigh-in/fetch-weigh-in-data-for-coach-teams";
import {deleteCoachApp} from "./coach/delete-coach";
import {deleteCoachTeamApp} from "./coach/delete-coach-team";
import {fetchBecomeCoachRequestsApp} from "./coach/fetch-become-coach-requests";
import {
  respondBecomeCoachRequestApp} from "./coach/respond-become-coach-request";
import {SavePlayerInitialDataApp} from "./player/create-initial-player-data";
import {deletePlayerApp} from "./player/delete-player";
import {deletePlayerTeamApp} from "./player/delete-player-team";
import {EditPlayerInitialDataApp} from "./player/edit-initial-player-data";
import {createSeasonApp} from "./season/create-season";
import {archiveSeasonApp} from "./season/archive-season";
import {createTeamApp} from "./team/create-team";
import {deleteTeamApp} from "./team/delete-team";
import {editTeamApp} from "./team/edit-team";
import {FetchCoachesOnTeamApp} from "./team/fetch-all-coaches-on-team";
import {FetchPlayersOnTeamApp} from "./team/fetch-all-players-on-team";
import {FetchAllTeamsApp} from "./team/fetch-all-teams";
import {FetchCoachTeamsApp} from "./coach/fetch-coach-teams";
import {deleteUserApp} from "./user/delete-user";
import {IsAdminApp} from "./admin/is-admin";
import {IsCoachApp} from "./coach/is-coach";
import {IsPlayerApp} from "./player/is-player";
import {UserInfoApp} from "./user/user-info";

// eslint-disable-next-line max-len
import {FetchPointsBreakDownForPlayerInTeam} from "./weigh-in/fetch-points-breakdown-for-player-in-team";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createAdmin = functions.https
  .onRequest(createAdminApp);

export const isAdmin = functions.https
  .onRequest(IsAdminApp);

export const createUser = functions.https
  .onRequest(createUserApp);

export const deleteUser = functions.https
  .onRequest(deleteUserApp);

export const assignUserAsCoach = functions.https
  .onRequest(assignCoachApp);

export const assignCoachToTeam = functions.https
  .onRequest(assignCoachTeamApp);

export const deleteCoach = functions.https
  .onRequest(deleteCoachApp);

export const isCoach = functions.https.onRequest(IsCoachApp);

export const deleteCoachFromTeam = functions.https
  .onRequest(deleteCoachTeamApp);

export const assignPlayerToTeam = functions.https
  .onRequest(assignPlayerTeamApp);

export const isPlayer = functions.https.onRequest(IsPlayerApp);

export const requestToBecomeCoach = functions.https
  .onRequest(becomeCoachApp);

export const fetchBecomeCoachRequests = functions.https
  .onRequest(fetchBecomeCoachRequestsApp);

export const respondBecomeCoachRequest = functions.https
  .onRequest(respondBecomeCoachRequestApp);

export const assignUserAsPlayer = functions.https
  .onRequest(becomePlayerApp);

export const deletePlayer = functions.https
  .onRequest(deletePlayerApp);

export const deletePlayerFromTeam = functions.https
  .onRequest(deletePlayerTeamApp);

export const createInitialPlayerData = functions.https
  .onRequest(SavePlayerInitialDataApp);

export const editInitialPlayerData = functions.https
  .onRequest(EditPlayerInitialDataApp);

export const createSeason = functions.https
  .onRequest(createSeasonApp);

export const archiveSeason = functions.https
  .onRequest(archiveSeasonApp);

export const createTeam = functions.https
  .onRequest(createTeamApp);

export const deleteTeam = functions.https
  .onRequest(deleteTeamApp);

export const editTeam = functions.https
  .onRequest(editTeamApp);

export const fetchAllCoachesOnTeam = functions.https
  .onRequest(FetchCoachesOnTeamApp);

export const fetchAllPlayersOnTeam = functions.https
  .onRequest(FetchPlayersOnTeamApp);

export const fetchAllTeams = functions.https
  .onRequest(FetchAllTeamsApp);

export const fetchCoachTeams = functions.https
  .onRequest(FetchCoachTeamsApp);

export const saveWeighInData = functions.https
  .onRequest(SaveWeighInDataApp);

export const fetchWeighInDataForLoggedInUser = functions.https
  .onRequest(FetchWeighInDataForLoggedInUserApp);

export const fetchWeighInDataForGivenTeam = functions.https
  .onRequest(FetchWeighInDataForGivenTeamApp);

export const fetchWeighInDataForGivenPlayerOnCoachesTeam = functions.https
  .onRequest(FetchWeighInDataForGivenPlayerOnCoachTeamsApp);

export const fetchWeighInDataForCoachesTeams = functions.https
  .onRequest(FetchWeighInDataForCoachTeamsApp);

export const fetchPointsBreakDownForPlayerInTeam = functions.https
  .onRequest(FetchPointsBreakDownForPlayerInTeam);

export const userInfo = functions.https
  .onRequest(UserInfoApp);
