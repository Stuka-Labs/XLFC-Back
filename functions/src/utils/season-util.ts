import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;

export const isSeasonInProgress = async (): Promise<boolean> => {
  try {
    const seasonRef = db.collection("seasons").where("archived", "==", false);
    const maybeSeason = await seasonRef.get();
    return !maybeSeason.empty;
  } catch (err) {
    return false;
  }
};

export const seasonExists = async (seasonId: string): Promise<boolean> => {
  try {
    const maybeSeason = await db.collection("seasons").doc(seasonId).get();
    return maybeSeason.exists;
  } catch (err) {
    return false;
  }
};

export const getLatestSeasonInProgress = async () => {
  try {
    const seasonRef = db.collection("seasons").where("archived", "==", false);
    const maybeSeason = await seasonRef.get();
    if (maybeSeason.empty) {
      return undefined;
    }
    const seasons: DocumentData[] = [];
    maybeSeason.forEach((season) => {
      seasons.push({
        ...season.data(),
        id: season.id,
      });
    });
    return seasons[0];
  } catch (err) {
    return undefined;
  }
};

export const getSeasonArchivedLast = async () => {
  const seasons =
      await db.collection("seasons")
        .where("archived", "==", true)
        .orderBy("year", "desc")
        .get();
  if (seasons.empty) return undefined;
  const data: DocumentData[] = [];
  seasons.forEach((season) => {
    data.push(season.data());
  });
  return data[0];
};
