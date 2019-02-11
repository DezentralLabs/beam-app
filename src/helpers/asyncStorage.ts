import { AsyncStorage } from "react-native";

export async function asyncStorageSave(key: string, value: any) {
  const jsonValue = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`AsyncStorage: saved value for key: ${key}`);
  } catch (err) {
    console.log(
      `AsyncStorage: failed to save value for key: ${key} error: ${err}`
    );
  }
}

export async function asyncStorageLoad(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      console.log(`AsyncStorage: loaded value for key: ${key}`);
      const jsonValue = JSON.parse(data);
      return jsonValue;
    }
    console.log(`AsyncStorage: value does not exist for key: ${key}`);
  } catch (err) {
    console.log(
      `AsyncStorage: failed to load value for key: ${key} error: ${err}`
    );
  }
  return null;
}

export async function asyncStorageDelete(key: string) {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`AsyncStorage: removed value for key: ${key}`);
  } catch (err) {
    console.log(
      `AsyncStorage: failed to remove value for key: ${key} error: ${err}`
    );
  }
}

// -- Profile --------------------------------------------------------------- //

const profileKey = "BEAM_PROFILE_DETAILS";

export async function saveProfile(profile: any) {
  await asyncStorageSave(profileKey, profile);
}

export async function getProfile() {
  return await asyncStorageLoad(profileKey);
}

export async function updateProfile(updatedProfile: any) {
  const profile = getProfile();
  const newProfile = { ...profile, ...updatedProfile };
  await saveProfile(newProfile);
}

export async function deleteProfile(key: string) {
  await asyncStorageDelete(profileKey);
}
