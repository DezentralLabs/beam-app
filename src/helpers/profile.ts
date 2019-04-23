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
  const key = profileKey(address);
  await apiSetProfile(address, profile);
  await asyncStorageSave(key, profile);
}

export async function getProfile(address: string): Promise<IProfile | null> {
  if (!address) {
    return null;
  }

  const key = profileKey(address);

  let profile = await asyncStorageLoad(key);

  if (!profile) {
    const result = await apiGetProfile(address);

    if (result) {
      profile = result;
    }
  }
  return profile;
}

export async function updateProfile(address: string, updatedProfile: any) {
  const profile = await getProfile(address);
  const newProfile = { ...profile, ...updatedProfile };
  await saveProfile(address, newProfile);
}

export async function updatePinnedFiles(
  address: string,
  newPinnedFiles: any[]
) {
  const profile = await getProfile(address);
  if (profile) {
    const updatedPinnedFiles = profile.pinnedFiles
      ? [...profile.pinnedFiles, ...newPinnedFiles]
      : newPinnedFiles;
    updateProfile(address, { pinnedFiles: updatedPinnedFiles });
  }
}

export async function getPinnedFiles(address: string) {
  const profile = await getProfile(address);

  let images: IFileJson[] = [];
  if (profile && profile.pinnedFiles && profile.pinnedFiles.length) {
    await Promise.all(
      profile.pinnedFiles.map(
        async (fileHash: string): Promise<void> => {
          let image = null;

          const filePath = formatFilePath(fileHash);

          try {
            const result = await readFile(filePath);

            if (result) {
              image = JSON.parse(result);
            } else {
              image = await apiFetchFile(fileHash);
            }
          } catch (error) {
            image = await apiFetchFile(fileHash);
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
