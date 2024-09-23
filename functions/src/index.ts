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
import {assignCoachApp} from "./admin/assign-coach";
import {assignCoachTeamApp} from "./admin/assign-coach-team";
import {assignPlayerTeamApp} from "./player/assign-team";
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

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createAdmin = functions.https
  .onRequest(createAdminApp);

export const createUser = functions.https
  .onRequest(createUserApp);

export const assignUserAsCoach = functions.https
  .onRequest(assignCoachApp);

export const assignCoachToTeam = functions.https
  .onRequest(assignCoachTeamApp);

export const assignPlayerToTeam = functions.https
  .onRequest(assignPlayerTeamApp);

export const requestToBecomeCoach = functions.https
  .onRequest(becomeCoachApp);

export const assignUserAsPlayer = functions.https
  .onRequest(becomePlayerApp);

export const saveWeighInData = functions.https
  .onRequest(SaveWeighInDataApp);

export const fetchWeighInDataForLoggedInUser = functions.https
  .onRequest(FetchWeighInDataForLoggedInUserApp);

export const fetchWeighInDataForGivenTeam = functions.https
  .onRequest(FetchWeighInDataForGivenTeamApp);

export const fetchWeighInDataForGivenPlayerOnCoachesTeams = functions.https
  .onRequest(FetchWeighInDataForGivenPlayerOnCoachTeamsApp);

export const fetchWeighInDataForCoachesTeams = functions.https
  .onRequest(FetchWeighInDataForCoachTeamsApp);
