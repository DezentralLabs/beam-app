import { CameraRoll } from "react-native";
import { createWallet } from "../helpers/wallet";
import {
  selectFile,
  unzipFile,
  scanDirectory
  // selectImage
} from "../helpers/utils";
import {
  getProfile,
  saveProfile,
  savePinnedFile,
  getPinnedFiles,
  updatePinnedFiles
} from "../helpers/profile";
import { loadWallet } from "../helpers/wallet";
import { IFileJson } from "../helpers/types";
import { navigate, goBack } from "../navigation";
// import { Alert } from "react-native";

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_INIT_REQUEST = "account/ACCOUNT_INIT_REQUEST";
const ACCOUNT_INIT_SUCCESS = "account/ACCOUNT_INIT_SUCCESS";
const ACCOUNT_INIT_FAILURE = "account/ACCOUNT_INIT_FAILURE";

const ACCOUNT_UPDATE_USERNAME = "account/ACCOUNT_UPDATE_USERNAME";

const ACCOUNT_CREATE_REQUEST = "account/ACCOUNT_CREATE_REQUEST";
const ACCOUNT_CREATE_SUCCESS = "account/ACCOUNT_CREATE_SUCCESS";
const ACCOUNT_CREATE_FAILURE = "account/ACCOUNT_CREATE_FAILURE";

const ACCOUNT_UPDATE_SEEDPHRASE = "account/ACCOUNT_UPDATE_SEEDPHRASE";

const ACCOUNT_RECOVERY_REQUEST = "account/ACCOUNT_RECOVERY_REQUEST";
const ACCOUNT_RECOVERY_SUCCESS = "account/ACCOUNT_RECOVERY_SUCCESS";
const ACCOUNT_RECOVERY_FAILURE = "account/ACCOUNT_RECOVERY_FAILURE";

const ACCOUNT_ADD_IMAGE_REQUEST = "account/ACCOUNT_ADD_IMAGE_REQUEST";
const ACCOUNT_ADD_IMAGE_SUCCESS = "account/ACCOUNT_ADD_IMAGE_SUCCESS";
const ACCOUNT_ADD_IMAGE_FAILURE = "account/ACCOUNT_ADD_IMAGE_FAILURE";

const ACCOUNT_IMPORT_REQUEST = "account/ACCOUNT_IMPORT_REQUEST";
const ACCOUNT_IMPORT_SUCCESS = "account/ACCOUNT_IMPORT_SUCCESS";
const ACCOUNT_IMPORT_FAILURE = "account/ACCOUNT_IMPORT_FAILURE";

const ACCOUNT_UPDATE_SELECTED = "account/ACCOUNT_UPDATE_SELECTED";

const ACCOUNT_UPLOAD_REQUEST = "account/ACCOUNT_UPLOAD_REQUEST";
const ACCOUNT_UPLOAD_SUCCESS = "account/ACCOUNT_UPLOAD_SUCCESS";
const ACCOUNT_UPLOAD_FAILURE = "account/ACCOUNT_UPLOAD_FAILURE";

const ACCOUNT_UPLOAD_IMAGE = "account/ACCOUNT_UPLOAD_IMAGE";

const ACCOUNT_LOAD_PINNED_REQUEST = "account/ACCOUNT_LOAD_PINNED_REQUEST";
const ACCOUNT_LOAD_PINNED_SUCCESS = "account/ACCOUNT_LOAD_PINNED_SUCCESS";
const ACCOUNT_LOAD_PINNED_FAILURE = "account/ACCOUNT_LOAD_PINNED_FAILURE";

// -- Actions --------------------------------------------------------------- //

export const accountInit = () => async (dispatch: any) => {
  dispatch({ type: ACCOUNT_INIT_REQUEST });
  try {
    const account = await loadWallet();
    // Alert.alert("[accountInit] account", JSON.stringify(account));
    // console.log("[accountInit] account", account);
    if (account) {
      const profile = await getProfile(account.address);
      const username = profile.username;
      // Alert.alert("[accountInit] profile", JSON.stringify(profile));
      // console.log("[accountInit] profile", profile);

      dispatch({
        type: ACCOUNT_INIT_SUCCESS,
        payload: {
          account,
          username
        }
      });
      dispatch(accountLoadPinnedFiles());
    } else {
      dispatch({
        type: ACCOUNT_INIT_SUCCESS,
        payload: {
          account: { address: "" },
          username: ""
        }
      });
      navigate("Onboarding");
    }
  } catch (error) {
    dispatch({ type: ACCOUNT_INIT_FAILURE });
  }
};

export const accountLoadPinnedFiles = () => async (
  dispatch: any,
  getState: any
) => {
  const { account } = getState().account;

  // Alert.alert("[accountLoadPinnedFiles] account", JSON.stringify(account));
  // console.log("[accountLoadPinnedFiles] account", account);

  dispatch({ type: ACCOUNT_LOAD_PINNED_REQUEST });

  try {
    const images = await getPinnedFiles(account.address);

    // Alert.alert("[accountLoadPinnedFiles] images", JSON.stringify(images));
    // console.log("[accountLoadPinnedFiles] images", images);

    dispatch({
      type: ACCOUNT_LOAD_PINNED_SUCCESS,
      payload: images
    });
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_LOAD_PINNED_FAILURE });
  }
};

export const accountUpdateUsername = (username: string) => async (
  dispatch: any
) => {
  dispatch({ type: ACCOUNT_UPDATE_USERNAME, payload: username });
};

export const accountCreateNew = () => async (dispatch: any, getState: any) => {
  dispatch({ type: ACCOUNT_CREATE_REQUEST });
  try {
    const { username } = getState().account;
    const account = await createWallet();
    saveProfile(account.address, {
      username: username,
      pinnedFiles: []
    });
    console.log("[accountCreateNew] account.address", account.address);
    console.log("[accountCreateNew] username", username);

    dispatch({ type: ACCOUNT_CREATE_SUCCESS, payload: account });
    navigate("AccountProfile");
  } catch (error) {
    dispatch({ type: ACCOUNT_CREATE_FAILURE });
  }
};

export const accountUpdateSeedPhrase = (seedPhrase: string) => async (
  dispatch: any
) => {
  dispatch({ type: ACCOUNT_UPDATE_SEEDPHRASE, payload: seedPhrase });
};

export const accountRecovery = () => (dispatch: any) => {
  dispatch({ type: ACCOUNT_IMPORT_REQUEST });
  try {
    dispatch({ type: ACCOUNT_IMPORT_SUCCESS });
    navigate("AccountProfile");
  } catch (error) {
    dispatch({ type: ACCOUNT_IMPORT_FAILURE });
  }
};

export const accountAddImage = () => async (dispatch: any, getState: any) => {
  // const { account } = getState().account;
  dispatch({ type: ACCOUNT_ADD_IMAGE_REQUEST });
  try {
    const result = await CameraRoll.getPhotos({ first: 1 });
    console.log("[accountAddImage] result", result);

    // const file = await selectImage();
    // console.log("[accountAddImage] file", file);

    // const fileJson = {
    //   name: file.fileName,
    //   mime: file.type,
    //   file: file.uri,
    //   meta: {
    //     added: Date.now(),
    //     modified: Date.now(),
    //     keywords: []
    //   }
    // };

    const fileJson = {
      name: "",
      mime: "",
      file: "",
      meta: {
        added: "",
        modified: "",
        keywords: []
      }
    };

    // const fileHash = await savePinnedFile(fileJson);
    // updatePinnedFiles(account.address, [fileHash]);
    dispatch({ type: ACCOUNT_ADD_IMAGE_SUCCESS, payload: fileJson });
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_ADD_IMAGE_FAILURE });
  }
};

export const accountImport = () => async (dispatch: any) => {
  dispatch({ type: ACCOUNT_IMPORT_REQUEST });
  try {
    const file = await selectFile();
    const resultPath = await unzipFile(file.uri);
    const imported = await scanDirectory(resultPath);
    if (imported && imported.length) {
      dispatch({ type: ACCOUNT_IMPORT_SUCCESS, payload: imported });
      navigate("Import");
    } else {
      console.error("Failed to import images");
      dispatch({ type: ACCOUNT_IMPORT_FAILURE });
    }
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_IMPORT_FAILURE });
  }
};

export const accountUpdateSelected = (file: IFileJson) => async (
  dispatch: any,
  getState: any
) => {
  let selected: IFileJson[] = [];
  let isNewFile = true;
  const prevSelected = getState().account.selected;

  prevSelected.forEach((prevFile: IFileJson) => {
    if (prevFile.name !== file.name) {
      selected.push(prevFile);
    } else {
      isNewFile = false;
    }
  });

  if (isNewFile) {
    selected.push(file);
  }

  dispatch({ type: ACCOUNT_UPDATE_SELECTED, payload: selected });
};

export const accountUpload = () => async (dispatch: any, getState: any) => {
  const { account, selected } = getState().account;
  dispatch({ type: ACCOUNT_UPLOAD_REQUEST });
  try {
    goBack();
    const newPinnedFiles = await Promise.all(
      selected.map(async (fileJson: IFileJson) => {
        const fileHash = await savePinnedFile(fileJson);
        dispatch({ type: ACCOUNT_UPLOAD_IMAGE, payload: fileJson });
        return fileHash;
      })
    );
    updatePinnedFiles(account.address, newPinnedFiles);
    dispatch({ type: ACCOUNT_UPLOAD_SUCCESS });
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_UPLOAD_FAILURE });
  }
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  uploading: false,
  initiating: false,
  loading: false,
  recoverSeedPhrase: "",
  username: "",
  address: "",
  selected: [],
  imported: [],
  uploaded: [],
  images: [],
  account: {}
};

export default (state = INITIAL_STATE, action: any) => {
  console.log("\n------------------------------------------------");
  console.log("==========>", action.type);
  console.log("==========>", action.payload);
  console.log("------------------------------------------------\n");
  switch (action.type) {
    case ACCOUNT_INIT_REQUEST:
      return {
        ...state,
        initiating: true
      };
    case ACCOUNT_INIT_SUCCESS:
      return {
        ...state,
        initiating: false,
        username: action.payload.username,
        account: action.payload.account,
        address: action.payload.account.address
      };
    case ACCOUNT_INIT_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACCOUNT_LOAD_PINNED_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACCOUNT_LOAD_PINNED_SUCCESS:
      return {
        ...state,
        loading: false,
        images: action.payload
      };
    case ACCOUNT_LOAD_PINNED_FAILURE:
      return {
        ...state,
        initiating: false
      };
    case ACCOUNT_UPDATE_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case ACCOUNT_CREATE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACCOUNT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        account: action.payload,
        address: action.payload.address
      };
    case ACCOUNT_CREATE_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACCOUNT_UPDATE_SEEDPHRASE:
      return {
        ...state,
        recoverSeedPhrase: action.payload
      };
    case ACCOUNT_RECOVERY_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACCOUNT_RECOVERY_SUCCESS:
      return {
        ...state,
        loading: false,
        images: action.payload
      };
    case ACCOUNT_RECOVERY_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACCOUNT_UPDATE_SEEDPHRASE:
      return {
        ...state,
        recoverSeedPhrase: action.payload
      };
    case ACCOUNT_IMPORT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACCOUNT_IMPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        imported: action.payload,
        selected: [],
        uploaded: []
      };
    case ACCOUNT_IMPORT_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACCOUNT_UPDATE_SELECTED:
      return {
        ...state,
        selected: action.payload
      };
    case ACCOUNT_UPLOAD_REQUEST:
      return {
        ...state,
        uploading: true
      };
    case ACCOUNT_UPLOAD_SUCCESS:
      return {
        ...state,
        uploading: false,
        selected: [],
        uploaded: []
      };
    case ACCOUNT_UPLOAD_FAILURE:
      return {
        ...state,
        uploading: false,
        selected: [],
        uploaded: []
      };
    case ACCOUNT_UPLOAD_IMAGE:
      return {
        ...state,
        images: [...state.images, action.payload],
        uploaded: [...state.uploaded, action.payload]
      };
    default:
      return state;
  }
};
