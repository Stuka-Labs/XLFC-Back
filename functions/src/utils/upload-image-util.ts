import {v4 as uuidv4} from "uuid";
import {bucket} from "../init";

export const uploadImage = async (teamLogo) => {
  const uuid = uuidv4();
  const buffer = Buffer.from(teamLogo.data.split(",")[1], "base64"); // Decode base64 image

  const fileName = `users/${uuid}.${teamLogo.format}`; // Use uuid for unique file name

  // Upload buffer to Google Cloud Storage
  const file = bucket.file(fileName);
  await file.save(buffer, {
    metadata: {
      contentType: `image/${teamLogo.format}`,
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
    public: true,
  });

  // Generate the download URL
  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
};
