import * as admin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import serviceAccount from "./xlfc-e8f8f-firebase-adminsdk-as1jd-8bbeb442ab.json";

export const app = initializeApp({
  projectId: "xlfc-e8f8f",
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://xlfc-e8f8f.firebaseio.com",
  storageBucket: "xlfc-e8f8f.appspot.com",
});
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

export const db = admin.firestore();
export const auth = admin.auth();
export const bucket = admin.storage().bucket();
