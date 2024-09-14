/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import {createPlayerApp} from "./player/create-player";
import {createManagerApp} from "./manager/create-manager";
import {createAdminApp} from "./admin/create-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createAdmin = functions.https.onRequest(createAdminApp);

export const createManager = functions.https.onRequest(createManagerApp);

export const createPlayer = functions.https.onRequest(createPlayerApp);