import axios from "axios";
import { IFileJson, IProfile } from "./types";

export const apiPinFile = async (fileJson: IFileJson) => {
  // console.log("[apiPinFile] fileJson", fileJson);
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    fileJson,
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
  return response;
};

export const apiFetchFile = async (fileHash: string) => {
  // console.log("[apiFetchFile] fileHash", fileHash);
  const response = await axios.get(`https://ipfs.io/ipfs/${fileHash}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return response;
};

export const apiGetProfile = async (address: string) => {
  console.log("[apiGetProfile] address", address);
  const response = await axios.get(
    `https://beam-backend-mkfadzpuwf.now.sh/${address}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );
  return response;
};

export const apiSetProfile = async (address: string, profile: IProfile) => {
  console.log("[apiSetProfile] address", address);
  const response = await axios.post(
    `https://beam-backend-mkfadzpuwf.now.sh/${address}`,
    { profile },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );
  return response;
};
