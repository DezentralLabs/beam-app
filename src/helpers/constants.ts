import { Platform, StatusBar, Dimensions, NativeModules } from "react-native";
import { IMimeTypes } from "./types";

export const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

export const WINDOW_WIDTH = Dimensions.get("window").width;

export const WINDOW_HEIGHT = Dimensions.get("window").height;

export const WINDOW_HEIGHT_NO_STATUS_BAR = STATUS_BAR_HEIGHT
  ? WINDOW_HEIGHT - STATUS_BAR_HEIGHT
  : WINDOW_HEIGHT;

export const DEVICE_LANGUAGE =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;

export const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

export const mimeTypes: IMimeTypes = {
  gif: "image/gif",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4"
};
