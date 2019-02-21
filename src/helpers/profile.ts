import {
  asyncStorageSave,
  asyncStorageLoad,
  asyncStorageDelete
} from "./asyncStorage";
import { writeFile, readFile, formatFilePath } from "../helpers/utils";
import { apiPinFile, apiFetchFile, apiSetProfile, apiGetProfile } from "./api";
import { IFileJson } from "./types";

export async function saveProfile(address: string, profile: any) {
  await apiSetProfile(address, profile);
  await asyncStorageSave(address, profile);
}

export async function getProfile(address: string) {
  let profile = null;
  profile = await asyncStorageLoad(address);
  if (!profile) {
    const response = await apiGetProfile(address);
    if (response && response.data.success) {
      profile = response.data;
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

  let images: IFileJson[] = [];
  if (pinnedFiles && pinnedFiles.length) {
    await Promise.all(
      pinnedFiles.map(
        async (fileHash: string): Promise<void> => {
          let image = null;

          const filePath = formatFilePath(fileHash);
          const result = await readFile(filePath);

          if (result) {
            image = JSON.parse(result);
          } else {
            const response = await apiFetchFile(fileHash);
            image = response.data;
          }

          if (image) {
            console.log("images.push(image)", image);
            images.push(image);
          }
        }
      )
    );
  }
  return images;
}

export async function savePinnedFile(address: string, fileJson: IFileJson) {
  const { pinnedFiles } = await getProfile(address);

  const { data } = await apiPinFile(fileJson);

  await writeFile(
    formatFilePath(data.IpfsHash),
    JSON.stringify(fileJson),
    "utf8"
  );

  const newPinnedFiles = pinnedFiles ? [...pinnedFiles, fileJson] : [fileJson];

  await updateProfile(address, { pinnedFiles: newPinnedFiles });

  return data.IpfsHash;
}

export async function removePinnedFile(address: string, ipfsHash: string) {
  const { pinnedFiles } = await getProfile(address);
  const newPinnedFiles = pinnedFiles.filter((file: any) => file === ipfsHash);
  await updateProfile(address, { pinnedFiles: newPinnedFiles });
}

export async function deleteProfile(address: string) {
  await asyncStorageDelete(address);
}
