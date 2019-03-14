import crypto from "crypto";
import { concatBuffers } from "./utils";

const AES_ALGORITHM = "AES-128-CBC";

export async function aesCbcEncrypt(
  data: Buffer,
  key: Buffer
): Promise<Buffer> {
  const encoding = "hex";
  const input: any = data.toString(encoding);
  const cipher = crypto.createCipher(AES_ALGORITHM, key);
  let encrypted = cipher.update(input, encoding, encoding);
  encrypted += cipher.final(encoding);
  const result = new Buffer(encrypted, encoding);
  return result;
}

export async function aesCbcDecrypt(
  data: Buffer,
  key: Buffer
): Promise<Buffer> {
  const decipher = crypto.createDecipher(AES_ALGORITHM, key);
  let decrypted = decipher.update(data);
  decrypted = concatBuffers(decrypted, decipher.final());
  const result = decrypted;
  return result;
}
