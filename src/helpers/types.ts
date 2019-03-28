export interface IFileMeta {
  added: number;
  modified: number;
  keywords: string[];
}

export interface IFileJson {
  name: string;
  mime: string;
  file: string;
  meta: IFileMeta;
}

export interface IMimeTypes {
  [ext: string]: string;
}

export interface IEncryptedData {
  iv: string;
  ephemPublicKey: string;
  ciphertext: string;
  mac: string;
}

export interface IProfile {
  username: string;
  pinnedFiles: string[];
}

export interface IDocumentPickerResult {
  fileName: string;
  fileSize: number;
  type: string;
  uri: string;
}
