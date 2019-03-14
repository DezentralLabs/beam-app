import axios, { AxiosInstance } from "axios";
import { IFileJson, IProfile } from "./types";
import { encrypt, decrypt } from "./wallet";

export const apiPinFile = async (
  fileJson: IFileJson
): Promise<string | null> => {
  const fileJsonString = JSON.stringify(fileJson);
  const cipher = await encrypt(fileJsonString);

  if (!cipher) {
    console.error("Failed to pin file");
    return null;
  }

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      cipher
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        pinata_api_key: "f705de5115120b3cabac",
        pinata_secret_api_key:
          "5cbc25412c0332187724e88b337bb239547f32be4aaad7a4cc9772af805ff0c0"
        // pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        // pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
      }
    }
  );

  let result = null;

  if (response.data.IpfsHash) {
    result = response.data.IpfsHash;
  }

  return result;
};

export const apiFetchFile = async (
  fileHash: string
): Promise<IFileJson | null> => {
  // console.log("[apiFetchFile] fileHash", fileHash);
  const response = await axios.get(`https://ipfs.io/ipfs/${fileHash}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const { cipher } = response.data;
  const fileJsonString = await decrypt(cipher);

  let fileJson = null;

  if (fileJsonString) {
    fileJson = JSON.parse(fileJsonString);
  }

  return fileJson;
};

const beamApi: AxiosInstance = axios.create({
  baseURL: "https://beam-backend-mkfadzpuwf.now.sh",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiGetProfile = async (
  address: string
): Promise<IProfile | null> => {
  console.log("[apiGetProfile] address", address);
  const response = await beamApi.get(`/${address}`);

  let result = null;

  if (response && response.data.success) {
    result = response.data.result;
  }

  return result;
};

export const apiSetProfile = async (
  address: string,
  profile: IProfile
): Promise<boolean | null> => {
  console.log("[apiSetProfile] address", address);
  const response = await beamApi.post(`/${address}`, { profile });

  let result = false;

  if (response && response.data.success) {
    result = true;
  }

  return result;
};
