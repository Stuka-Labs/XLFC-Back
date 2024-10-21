import {db} from "../init";

export const deleteCoach = async (coachUid) => {
  try {
    await db.collection("coaches").doc(coachUid).delete();
    return true;
  } catch (err) {
    return false;
  }
};

export const coachExists = async (coachUid: string): Promise<boolean> => {
  try {
    const coachRef = db.collection("coaches").doc(coachUid);
    const coach = await coachRef.get();
    return coach.exists;
  } catch (err) {
    return false;
  }
};

export const becomeCoachRequestExists =
    async (userUid: string): Promise<boolean> => {
      try {
        const becomeCoachRequest =
            await db.collection("becomeCoachRequests")
              .where("userUid", "==", userUid)
              .where("reviewed", "==", false).get();
        return !becomeCoachRequest.empty;
      } catch (err) {
        return false;
      }
    };
