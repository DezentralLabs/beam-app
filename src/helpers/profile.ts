import {
  asyncStorageSave,
  asyncStorageLoad,
  asyncStorageDelete
} from "./asyncStorage";
import { writeFile, readFile, formatFilePath } from "../helpers/utils";
import { apiPinFile, apiFetchFile, apiSetProfile, apiGetProfile } from "./api";
import { IFileJson, IProfile } from "./types";

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
  let profile = await asyncStorageLoad(key);
  // console.log("[getProfile] asyncStorageLoad profile", profile);
  if (!profile) {
    const response = await apiGetProfile(address);
    // console.log("[getProfile] apiGetProfile profile", response.data);
    if (response && response.data.success) {
      profile = response.data.result;
    }
  }
  return profile;
}

export async function updateProfile(address: string, updatedProfile: any) {
  const profile = await getProfile(address);
  const newProfile = { ...profile, ...updatedProfile };
  await saveProfile(address, newProfile);
}

export async function getPinnedFiles(address: string) {
  const { pinnedFiles } = await getProfile(address);

  async function fallbackFetchFile(fileHash: string) {
    const response = await apiFetchFile(fileHash);
    return response.data;
  }

  let images: IFileJson[] = [];
  if (pinnedFiles && pinnedFiles.length) {
    await Promise.all(
      pinnedFiles.map(
        async (fileHash: string): Promise<void> => {
          let image = null;

          const filePath = formatFilePath(fileHash);

          try {
            const result = await readFile(filePath);

            if (result) {
              image = JSON.parse(result);
            } else {
              image = await fallbackFetchFile(fileHash);
            }
          } catch (error) {
            image = await fallbackFetchFile(fileHash);
          }

          if (image) {
            images.push(image);
          }
        }
      )
    );
  }
  return images;
}

export async function savePinnedFile(fileJson: IFileJson) {
  const response = await apiPinFile(fileJson);
  const fileHash = response.data.IpfsHash;

  await writeFile(formatFilePath(fileHash), JSON.stringify(fileJson), "utf8");

  return fileHash;
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
