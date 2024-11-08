import { db } from "../init";
import * as functions from "firebase-functions";

/**
 * Calculates standard points for player based on weight entry
 * @param startWeight
 * @param weight
 * @returns
 */
export function calculateStandardPoints(
  startWeight: number,
  weight: number
): number {
  let points = 0;
  if (weight < startWeight) {
    points = 3;
  } else if (weight > startWeight) {
    points = 0;
  } else {
    points = 1;
  }
  return points;
}

/**
 * Calculates Bonus points for player
 * It checks for hattrick weight loss & Gain.
 * And then check other criteria for scoring bonus
 * @param playerData
 * @param weight
 * @returns
 */
export async function calculateBonusPoints(
  playerData: any,
  weight: number
): Promise<number> {
  let points = 0;
  const hattrickWeightLoss = await checkHattrickWeightStreak(
    playerData?.playerId,
    "loss"
  );
  const hattrickWeightGain = await checkHattrickWeightStreak(
    playerData?.playerId,
    "gain"
  );

  if (hattrickWeightLoss) {
    points += 3;
  }
  if (hattrickWeightGain) {
    points -= 3;
  }
  if (
    playerData.startBmi < 27 ||
    playerData.dailyFoodDiaryComplete ||
    playerData.weeklyStepsComplete ||
    playerData.parkRunParticipationComplete
  ) {
    points += 1;
  }
  if (weight > playerData?.startWeight) {
    points -= 1;
  }

  return points;
}

/**
 * It is helper function to check if it's a streak (win or loose)
 * @param playerId
 * @param streakType
 * @returns
 */
export const checkHattrickWeightStreak = async (
  playerId: string,
  streakType: "loss" | "gain"
): Promise<boolean> => {
  try {
    // Fetch the latest entry
    const latestEntrySnapshot = await getRecentWeighLogEntry(playerId);

    if (latestEntrySnapshot.empty) {
      return false;
    }

    const latestEntry = latestEntrySnapshot.docs[0].data();

    // eslint-disable-next-line max-len
    // Check if the latest entry has the required streak type and length of at least 3
    const isHattrick =
      latestEntry.streakType === streakType && latestEntry.streakLength >= 3;

    functions.logger.debug(
      // eslint-disable-next-line max-len
      `StreakType: ${latestEntry.streakType}, StreakLength: ${latestEntry.streakLength}, isHattrick: ${isHattrick}`
    );
    return isHattrick;
  } catch (error) {
    functions.logger.error("Error checking for hattrick weight streak", error);
    return false;
  }
};

/**
 * Helper function to fetch latest entry in weightLog collection
 * @param playerId
 * @returns
 */
export const getRecentWeighLogEntry = async (playerId: string) => {
  try {
    return await db
      .collection("weightLog")
      .where("playerId", "==", playerId)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();
  } catch (error) {
    functions.logger.debug(
      "manage-weighin-utils: failed to fetch latest weighin log entry"
    );
    throw error;
  }
};
