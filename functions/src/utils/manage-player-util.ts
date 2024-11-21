import {db} from "../init";
import * as functions from "firebase-functions";

export async function playerInitialDataAlreadySet(
  uid: string
): Promise<boolean> {
  try {
    const playerRef = db.collection("players").doc(uid);
    const playerDoc = await playerRef.get();

    if (playerDoc.exists) {
      const data = playerDoc.data();
      // Check if any of the initial data fields are set
      return (
        data?.startWeight !== undefined ||
        data?.height !== undefined ||
        data?.startBmi !== undefined
      );
    }

    // If the document doesn't exist, return false (data not set)
    return false;
  } catch (error) {
    functions.logger.error("Error checking player initial data:", error);
    return false;
  }
}
