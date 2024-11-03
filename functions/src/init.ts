import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";

// FOR FIREBASE STORAGE
const STORAGE_URL = process.env.FUNCTIONS_EMULATOR
  ? functions.config().storage.url
  : defineSecret("storage.url").value();

admin.initializeApp({
  storageBucket: STORAGE_URL,
});

export const db = admin.firestore();

export const auth = admin.auth();

export const bucket = admin.storage().bucket();
