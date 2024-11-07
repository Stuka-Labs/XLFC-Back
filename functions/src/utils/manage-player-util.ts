import { db } from "../init";
import * as functions from "firebase-functions";

export async function playerInitialDataAlreadySet(
  uid: string
): Promise<boolean> {
  try {
    const playerRef = db.collection("players").doc(uid);
    const playerDoc = await playerRef.get();

    if (playerDoc.exists) {
      const data = playerDoc.data();
      return (
        (data?.startWeight !== undefined && data.startWeight !== 0) ||
        (data?.height !== undefined && data.height !== 0) ||
        (data?.startBmi !== undefined && data.startBmi !== 0)
      );
    }

    return false;
  } catch (error) {
    functions.logger.error("Error checking player initial data:", error);
    return false;
  }
}
