import {
  asyncStorageSave,
  asyncStorageLoad,
  asyncStorageDelete
} from "./asyncStorage";
import { writeFile, readFile, formatFilePath } from "../helpers/utils";
import { apiPinFile, apiFetchFile, apiSetProfile, apiGetProfile } from "./api";
import { IFileJson, IProfile } from "./types";
// import { Alert } from "react-native";

const profileKey = (address: string) => {
  const KEY_PREFIX = "BEAM_PROFILE";
  const key = `${KEY_PREFIX}-${address.replace("0x", "")}`;
  return key;
};

export async function saveProfile(address: string, profile: any) {
  console.log("[saveProfile] address", address);
  console.log("[saveProfile] profile", profile);
  const key = profileKey(address);
  await apiSetProfile(address, profile);
  console.log("Successfully => apiSetProfile");
  await asyncStorageSave(key, profile);
  console.log("Successfully => asyncStorageSave");
}

export async function getProfile(address: string): Promise<IProfile> {
  const key = profileKey(address);

  // Alert.alert("[getProfile] address", JSON.stringify(address));
  // console.log("[getProfile] address", address);

  let profile = await asyncStorageLoad(key);

  // Alert.alert("[getProfile] profile", JSON.stringify(profile));
  // console.log("[getProfile] profile", profile);

  // console.log("[getProfile] asyncStorageLoad profile", profile);
  if (!profile) {
    const result = await apiGetProfile(address);

    // Alert.alert("[getProfile] result", JSON.stringify(result));
    // console.log("[getProfile] result", result);

    // console.log("[getProfile] apiGetProfile profile", response.data);
    if (result) {
      profile = result;
    }
  }
  return profile;
}

export async function updateProfile(address: string, updatedProfile: any) {
  const profile = await getProfile(address);
  console.log("[updateProfile] profile", profile);
  const newProfile = { ...profile, ...updatedProfile };
  console.log("[updateProfile] newProfile", newProfile);
  await saveProfile(address, newProfile);
}

export async function getPinnedFiles(address: string) {
  const { pinnedFiles } = await getProfile(address);

  // Alert.alert("[getPinnedFiles] pinnedFiles", JSON.stringify(pinnedFiles));
  // console.log("[getPinnedFiles] pinnedFiles", pinnedFiles);

  let images: IFileJson[] = [];
  if (pinnedFiles && pinnedFiles.length) {
    await Promise.all(
      pinnedFiles.map(
        async (fileHash: string): Promise<void> => {
          let image = null;

          const filePath = formatFilePath(fileHash);

          // Alert.alert("[getPinnedFiles] filePath", JSON.stringify(filePath));
          // console.log("[getPinnedFiles] filePath", filePath);

          try {
            // Alert.alert("[getPinnedFiles] readFile", "START");
            // console.log("[getPinnedFiles] readFile", 'START');

            const result = await readFile(filePath);

            // Alert.alert("[getPinnedFiles] readFile", "END");
            // console.log("[getPinnedFiles] readFile", 'END');

            if (result) {
              image = JSON.parse(result);
            } else {
              // Alert.alert("[getPinnedFiles] apiFetchFile", "START");
              // console.log("[getPinnedFiles] apiFetchFile", 'START');

              image = await apiFetchFile(fileHash);

              // Alert.alert("[getPinnedFiles] apiFetchFile", "END");
              // console.log("[getPinnedFiles] apiFetchFile", 'END');
            }
          } catch (error) {
            // Alert.alert("[getPinnedFiles] apiFetchFile", "START");
            // console.log("[getPinnedFiles] apiFetchFile", 'START');

            image = await apiFetchFile(fileHash);

            // Alert.alert("[getPinnedFiles] apiFetchFile", "END");
            // console.log("[getPinnedFiles] apiFetchFile", 'END');
          }

          if (image) {
            // Alert.alert("[getPinnedFiles] image", JSON.stringify(image));
            // console.log("[getPinnedFiles] image", image);

            images.push(image);
          }
        }
      )
    );
  }
  return images;
}

export async function savePinnedFile(fileJson: IFileJson) {
  const fileHash = await apiPinFile(fileJson);

  if (fileHash) {
    await writeFile(formatFilePath(fileHash), JSON.stringify(fileJson), "utf8");
    return fileHash;
  }

  return null;
}

// export async function removePinnedFile(address: string, ipfsHash: string) {
//   const { pinnedFiles } = await getProfile(address);
//   const newPinnedFiles = pinnedFiles.filter((file: any) => file === ipfsHash);
//   await updateProfile(address, { pinnedFiles: newPinnedFiles });
// }

export async function deleteProfile(address: string) {
  const key = profileKey(address);
  await asyncStorageDelete(key);
}
