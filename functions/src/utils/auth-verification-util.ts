import {db, auth} from "../init";
import {Request} from "express";
import {firestore} from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;

/**
 * Determines If The Passed In req contains an authenticated admin.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is an admin or not.
 */
export const authIsAdmin = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    if (!uid) return false;
    const maybeAdmin: DocumentSnapshot<DocumentData, DocumentData> =
        await db.collection("admins").doc(uid).get();
    return maybeAdmin.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated Coach.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a coach or not.
 */
export const authIsCoach = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const coach = req["coach"];
    if (!uid || !coach) return false;
    const maybeCoach: DocumentSnapshot<DocumentData, DocumentData> =
        await db.collection("coaches").doc(uid).get();
    return maybeCoach.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated User.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a valid user or not.
 */
export const authIsUser = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    if (!uid) return false;
    const maybeUser: DocumentSnapshot<DocumentData, DocumentData> =
        await db.collection("users").doc(uid).get();
    return maybeUser.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated Player
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a valid user or not.
 */
export const authIsPlayer = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const player = req["player"];
    if (!uid || !player) return false;
    const maybePlayer: DocumentSnapshot<DocumentData, DocumentData> =
        await db.collection("players").doc(uid).get();
    return maybePlayer.exists;
  } catch (err) {
    return false;
  }
};

export const emailAlreadyExists = async (value: string): Promise<boolean> => {
  try {
    const maybeUser = await auth.getUserByEmail(value);
    return maybeUser != null;
  } catch (err) {
    return false;
  }
};

export const phoneAlreadyExists = async (value: string): Promise<boolean> => {
  try {
    const maybeUser =
        await db.collection("users").where("phoneNumber", "==", value).get();
    return maybeUser != null;
  } catch (err) {
    return false;
  }
};
