import { DocumentPicker } from "react-native-document-picker";
import flattenDeep from "lodash.flattendeep";
import RNFileSystem from "react-native-fs";
import { unzip } from "react-native-zip-archive";
import { IFileJson } from "./types";
import { mimeTypes } from "./constants";

export function formatFilePath(
  fileName: string,
  fileExtension: string = "json"
) {
  return `${RNFileSystem.DocumentDirectoryPath}/${fileName}.${fileExtension}`;
}

export function getFileName(filePath: string) {
  const fileName = filePath.replace(/^.*[\\\/]/, "");
  if (fileName) {
    return fileName;
  }
  return "";
}

export function getFileExtension(fileName: string) {
  const regex = /(?:\.([^.]+))?$/;
  const fileExtension = regex.exec(fileName); // "txt"
  if (fileExtension && fileExtension[1]) {
    return fileExtension[1];
  }
  return "";
}

export function getMimeType(fileName: string) {
  const fileExtension = getFileExtension(fileName);
  const mimeType = mimeTypes[fileExtension];
  if (mimeType) {
    return mimeType;
  }
  return "";
}

export function getBase64ImgSrc(base64: string, mime: string) {
  const prefix = `data:${mime};base64,`;
  const imgSrc = `${prefix}${base64}`;
  return imgSrc;
}

export function isImage(filePath: string) {
  return /\.(jpe?g|png|gif|bmp)$/i.test(filePath);
}

export function selectFile(): Promise<{
  fileName: string;
  fileSize: number;
  uri: string;
}> {
  return new Promise((resolve, reject) => {
    DocumentPicker.show(
      {
        filetype: ["public.data"]
      },
      (error: Error, result: any) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
}

export async function unzipFile(filePath: string) {
  const fileName = getFileName(filePath);
  const sourcePath = filePath.replace("file:///private", "");
  const targetPath = `${sourcePath.replace(
    `/${fileName}`,
    ""
  )}/import-${Date.now()}`;
  const resultPath = await unzip(sourcePath, targetPath);
  return resultPath;
}

export async function getStats(filePath: string) {
  const result = await RNFileSystem.stat(filePath);
  // console.log("[getStats] result", result);
  return result;
}

export async function readFile(filePath: string, encoding: string = "utf8") {
  const result = await RNFileSystem.readFile(filePath, encoding);
  // console.log("[readFile] result", result);
  return result;
}

export async function writeFile(filePath: string, data: any, encoding: string) {
  const result = await RNFileSystem.writeFile(filePath, data, encoding);
  // console.log("[writeFile] result", result);
  return result;
}

export async function scanDirectory(
  dirPath: string
): Promise<(IFileJson | any[] | null)[]> {
  const nodes = await RNFileSystem.readDir(dirPath);
  let files = await Promise.all(
    nodes.map(async node => {
      const path = node.path;
      if (node.isFile()) {
        let fileJson: IFileJson | null = null;
        if (isImage(path)) {
          const name = getFileName(path);
          const mime = getMimeType(name);
          const stats = await getStats(path);
          const base64 = await readFile(path, "base64");
          const uri = getBase64ImgSrc(base64, mime);
          fileJson = {
            name,
            mime,
            file: uri,
            meta: {
              added: new Date(stats.ctime).getTime(),
              modified: new Date(stats.mtime).getTime(),
              keywords: []
            }
          };
        }
        return fileJson;
      } else if (node.isDirectory()) {
        const files = await scanDirectory(path);
        return files;
      }
      return null;
    })
  );
  files = flattenDeep(files)
    .filter(x => !!x)
    .reverse();
  return files;
}
