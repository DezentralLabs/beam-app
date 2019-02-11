import axios, { AxiosInstance } from "axios";
import { IFileJson } from "./types";

const api = axios.create({
  baseURL: "https://api.pinata.cloud/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    pinata_api_key: "f705de5115120b3cabac",
    pinata_secret_api_key:
      "5cbc25412c0332187724e88b337bb239547f32be4aaad7a4cc9772af805ff0c0"
    // pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    // pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
  }
});

export const pinFile = (fileJson: IFileJson) =>
  api.post("pinning/pinJSONToIPFS", fileJson);

// export const fetchFile = (fileHash: string) =>
//   api.get(`/ipfs/${fileHash}`, {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     }
//   });
