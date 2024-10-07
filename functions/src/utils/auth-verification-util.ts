import {db} from "../init";

export const userSignedIn = (req) => {
  const uid = req["uid"];
  if (uid) {
    return true;
  } else {
    return false;
  }
};

export const authIsAdmin = async (req) => {
  try {
    const uid = req["uid"];
    const auth = req["admin"];
    if (!uid.exists) {
      return false;
    }
    if (!auth.exists) {
      return false;
    }
    const adminRef = db.collection("admins").doc(uid);
    const admin = await adminRef.get();
    return admin.exists;
  } catch (err) {
    return false;
  }
};

export const authIsCoach = async (req) => {
  const uid = req["uid"];
  if (!uid.exists) {
    return false;
  }
  const coachRef = db.collection("coaches").doc(uid);
  const coach = await coachRef.get();
  return coach.exists;
};

export const authIsUser = async (req) => {
  try {
    const uid = req["uid"];
    if (!uid.exists) {
      return false;
    }
    const userRef = db.collection("users").doc(uid);
    const user = await userRef.get();
    return user.exists;
  } catch (err) {
    return false;
  }
};

export const authIsPlayer = async (req) => {
  try {
    const uid = req["uid"];
    if (!uid.exists) {
      return false;
    }
    const playerRef = db.collection("players").doc(uid);
    const player = await playerRef.get();
    return player.exists;
  } catch (err) {
    return false;
  }
};

export const isAdmin = async (uid) => {
  const adminRef = db.collection("admins").doc(uid);
  const admin = await adminRef.get();
  return admin.exists;
};

export const isCoach = async (uid) => {
  const coachRef = db.collection("coaches").doc(uid);
  const coach = await coachRef.get();
  return coach.exists;
};

export const isPlayer = async (uid) => {
  const playerRef = db.collection("players").doc(uid);
  const player = await playerRef.get();
  return player.exists;
};

export const isUser = async (uid) => {
  const userRef = db.collection("users").doc(uid);
  const user = await userRef.get();
  return user.exists;
};
