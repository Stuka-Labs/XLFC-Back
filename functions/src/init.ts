// functions/src/init.ts

import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import serviceAccount from "./keys/xlfc-e8f8f-firebase-adminsdk-as1jd-8bbeb442ab.json";

// Set environment variables for Firebase Emulators in development
if (process.env.NODE_ENV === "development") {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  console.log("Running in Development Mode");
}

// Initialize Firebase App
export const app = initializeApp({
  projectId: "xlfc-e8f8f", // Ensure this matches your project ID
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://xlfc-e8f8f.firebaseio.com",
  storageBucket: "xlfc-e8f8f.appspot.com",
});

// Initialize Firestore, Auth, and Storage
export const db = admin.firestore();
export const auth = admin.auth();
export const bucket = admin.storage().bucket();

// Emulator logging for debugging in development
if (process.env.NODE_ENV === "development") {
  console.log("Firestore Emulator Host:", process.env.FIRESTORE_EMULATOR_HOST);
  console.log("Firebase Auth Emulator Host:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
}
