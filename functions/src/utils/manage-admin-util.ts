import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

export const adminExists = async (adminUid: string) => {
  try {
    const adminRef: DocumentReference<DocumentData, DocumentData> =
        db.collection("admins").doc(adminUid);
    const maybeAdmin = await adminRef.get();
    return maybeAdmin.exists;
  } catch (err) {
    return false;
  }
};
