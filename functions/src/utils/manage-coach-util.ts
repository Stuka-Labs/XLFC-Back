import {db} from "../init";

export const deleteCoach = async (coachUid) => {
  try {
    await db.collection("coaches").doc(coachUid).delete();
    return true;
  } catch (err) {
    return false;
  }
};
