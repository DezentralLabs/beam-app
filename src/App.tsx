import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList
} from "react-native";
import { DocumentPicker } from "react-native-document-picker";
import { unzip } from "react-native-zip-archive";
import flattenDeep from "lodash.flattendeep";
import RNFileSystem from "react-native-fs";
import base64js from "base64-js";
import Button from "./components/Button";
// import Card from "./components/Card";
// import Section from "./components/Section";
import {
  isImage,
  getFileName,
  getMimeType,
  getBase64ImgSrc
} from "./helpers/utils";
import { WINDOW_WIDTH } from "./helpers/constants";
import { IFileJson } from "./helpers/types";

interface IAppState {
  loading: boolean;
  images: IFileJson[];
}

export default class App extends React.Component<any, any> {
  state: IAppState = {
    loading: false,
    images: []
  };

  scanFolder = async (
    dirPath: string
  ): Promise<(IFileJson | any[] | null)[]> => {
    const nodes = await RNFileSystem.readDir(dirPath);
    let files = await Promise.all(
      nodes.map(async node => {
        const path = node.path;
        if (node.isFile()) {
          let fileJson: IFileJson | null = null;
          if (isImage(path)) {
            const name = getFileName(path);
            const mime = getMimeType(name);
            const stats = await RNFileSystem.stat(path);
            const base64 = await RNFileSystem.readFile(path, "base64");
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
          const files = await this.scanFolder(path);
          return files;
        }
        return null;
      })
    );
    files = flattenDeep(files)
      .filter(x => !!x)
      .reverse();
    return files;
  };

  selectFile = (): Promise<{
    fileName: string;
    fileSize: number;
    uri: string;
  }> => {
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
  };

  onUpload = async () => {
    try {
      await this.setState({ loading: true });
      const file = await this.selectFile();
      console.log("file", file);
      const sourcePath = file.uri.replace("file:///private", "");
      console.log("sourcePath", sourcePath);
      const targetPath = `${sourcePath.replace(
        `/${file.fileName}`,
        ""
      )}/import-${Date.now()}`;
      console.log("targetPath", targetPath);
      const resultPath = await unzip(sourcePath, targetPath);
      console.log("resultPath", resultPath);
      const images = await this.scanFolder(resultPath);
      if (images && images.length) {
        console.log("images", images);
        await this.setState({ loading: false, images: images });
      } else {
        console.error("Failed to load images");
        await this.setState({ loading: false });
      }
    } catch (error) {
      console.error(error);
      await this.setState({ loading: false });
    }
  };

  render() {
    const { loading, images } = this.state;
    const displayImages = !loading && images && images.length;
    return (
      <View style={styles.container}>
        {!displayImages && (
          <Text style={styles.description}>
            {loading ? "Uploading..." : "Upload your Instagram import"}
          </Text>
        )}
        <View
          style={[styles.content, displayImages ? styles.displayImages : {}]}
        >
          {!loading ? (
            !displayImages ? (
              <Button width={200} onPress={this.onUpload}>
                Upload
              </Button>
            ) : (
              <FlatList
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
                data={images}
                keyExtractor={image => image.name}
                renderItem={({ item }) => (
                  <Image
                    style={{
                      padding: 10,
                      flex: 1,
                      height: WINDOW_WIDTH / 3,
                      width: WINDOW_WIDTH / 3
                    }}
                    resizeMode={"cover"}
                    source={{ uri: item.file }}
                  />
                )}
              />
            )
          ) : (
            <ActivityIndicator size="small" color="grey" />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    marginTop: 20
  },
  displayImages: {
    flex: 1,
    width: "100%"
  },
  description: {
    fontSize: 18
  }
});
