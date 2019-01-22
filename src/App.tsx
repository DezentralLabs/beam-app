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
import Card from "./components/Card";
import Section from "./components/Section";

function isImage(filePath: string) {
  return /\.(jpe?g|png|gif|bmp)$/i.test(filePath);
}

interface IImageFile {
  data: ArrayBuffer;
  uri: string;
  path: string;
}

interface IAppState {
  loading: boolean;
  images: IImageFile[];
}

export default class App extends React.Component<any, any> {
  state: IAppState = {
    loading: false,
    images: []
  };

  scanFolder = async (
    dirPath: string
  ): Promise<(IImageFile | any[] | null)[]> => {
    const nodes = await RNFileSystem.readDir(dirPath);
    let files = await Promise.all(
      nodes.map(async node => {
        const path = node.path;
        if (node.isFile()) {
          let file: IImageFile | null = null;
          if (isImage(path)) {
            const BASE64_PREFIX = "data:image/jpeg;base64,";
            const base64 = await RNFileSystem.readFile(path, "base64");
            const uri = `${BASE64_PREFIX}${base64}`;
            const data = base64js.toByteArray(base64).buffer;
            file = {
              data: data,
              uri: uri,
              path: path
            };
          }
          return file;
        } else if (node.isDirectory()) {
          const files = await this.scanFolder(path);
          return files;
        }
        return null;
      })
    );
    files = flattenDeep(files).filter(x => !!x);
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
      const sourcePath = file.uri.replace("file:///private", "");
      const targetPath = `${sourcePath.replace(
        `/${file.fileName}`,
        ""
      )}/import-${Date.now()}`;
      const resultPath = await unzip(sourcePath, targetPath);
      const images = await this.scanFolder(resultPath);
      if (images && images.length) {
        console.log("images", images);
        await this.setState({ loading: false, images });
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
                data={images}
                keyExtractor={image => image.path}
                renderItem={({ item }) => (
                  // <Card>
                  //   <Section>
                  //     <Image
                  //       style={{
                  //         flex: 1,
                  //         alignSelf: "stretch"
                  //       }}
                  //       resizeMode={"contain"}
                  //       source={{ uri: item.uri }}
                  //     />
                  //   </Section>
                  // </Card>
                  <Image
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      width: "100%",
                      height: "100%",
                      minHeight: 200
                    }}
                    resizeMode={"contain"}
                    source={{ uri: item.uri }}
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
