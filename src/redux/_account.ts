import { createWallet } from "../helpers/wallet";
import { selectFile, unzipFile, scanDirectory } from "../helpers/utils";
import {
  getProfile,
  saveProfile,
  savePinnedFile,
  getPinnedFiles,
  updateProfile
} from "../helpers/profile";
import { loadWallet } from "../helpers/wallet";
import { IFileJson } from "../helpers/types";
import { navigate, goBack } from "../navigation";

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

const ACCOUNT_IMPORT_REQUEST = "account/ACCOUNT_IMPORT_REQUEST";
const ACCOUNT_IMPORT_SUCCESS = "account/ACCOUNT_IMPORT_SUCCESS";
const ACCOUNT_IMPORT_FAILURE = "account/ACCOUNT_IMPORT_FAILURE";

const ACCOUNT_UPDATE_SELECTED = "account/ACCOUNT_UPDATE_SELECTED";

const ACCOUNT_UPLOAD_REQUEST = "account/ACCOUNT_UPLOAD_REQUEST";
const ACCOUNT_UPLOAD_SUCCESS = "account/ACCOUNT_UPLOAD_SUCCESS";
const ACCOUNT_UPLOAD_FAILURE = "account/ACCOUNT_UPLOAD_FAILURE";

const ACCOUNT_LOAD_PINNED_REQUEST = "account/ACCOUNT_LOAD_PINNED_REQUEST";
const ACCOUNT_LOAD_PINNED_SUCCESS = "account/ACCOUNT_LOAD_PINNED_SUCCESS";
const ACCOUNT_LOAD_PINNED_FAILURE = "account/ACCOUNT_LOAD_PINNED_FAILURE";

const ACCOUNT_ADD_IMAGE = "account/ACCOUNT_ADD_IMAGE";

const ACCOUNT_DISPLAY_IMAGE = "account/ACCOUNT_DISPLAY_IMAGE";
const ACCOUNT_HIDE_IMAGE = "account/ACCOUNT_HIDE_IMAGE";

// -- Actions --------------------------------------------------------------- //

export const accountInit = () => async (dispatch: any) => {
  dispatch({ type: ACCOUNT_INIT_REQUEST });
  try {
    const account = await loadWallet();
    // console.log("[accountInit] account", account);
    if (account) {
      const profile = await getProfile(account.address);
      const username = profile.username;
      // console.log("[accountInit] account.address", account.address);
      // console.log("[accountInit] profile.username", profile.username);

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

  dispatch({ type: ACCOUNT_LOAD_PINNED_REQUEST });

  try {
    const images = await getPinnedFiles(account.address);
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

export const accountImport = () => async (dispatch: any) => {
  dispatch({ type: ACCOUNT_IMPORT_REQUEST });
  try {
    const file = await selectFile();
    console.log("[accountImport] file", file);
    const resultPath = await unzipFile(file.uri);
    console.log("[accountImport] resultPath", resultPath);
    const imported = await scanDirectory(resultPath);
    console.log("[accountImport] imported", imported);
    if (imported && imported.length) {
      console.log("imported", imported);
      console.log(
        "imported && imported.length",
        `${imported && imported.length}`
      );
      dispatch({ type: ACCOUNT_IMPORT_SUCCESS, payload: imported });
      navigate("Import");
      console.log('navigate("Import")');
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
        const fileHash = await dispatch(accountAddImage(fileJson));
        return fileHash;
      })
    );
    const profile = await getProfile(account.address);
    const updatedPinnedFiles = profile.pinnedFiles
      ? [...profile.pinnedFiles, ...newPinnedFiles]
      : newPinnedFiles;
    updateProfile(account.address, { pinnedFiles: updatedPinnedFiles });
    dispatch({ type: ACCOUNT_UPLOAD_SUCCESS });
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_UPLOAD_FAILURE });
  }
};

export const accountAddImage = (fileJson: IFileJson) => async (
  dispatch: any,
  getState: any
) => {
  const { images } = getState().account;

  const fileHash = await savePinnedFile(fileJson);

  const updatedImages = [...images, fileJson];

  dispatch({ type: ACCOUNT_ADD_IMAGE, payload: updatedImages });

  return fileHash;
};

export const accountDisplayImage = (fileJson: IFileJson) => async (
  dispatch: any
) => {
  dispatch({ type: ACCOUNT_DISPLAY_IMAGE, payload: fileJson });
  navigate("Display");
};

export const accountHideImage = () => async (dispatch: any) => {
  goBack();
  dispatch({ type: ACCOUNT_HIDE_IMAGE });
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
  images: [],
  account: {},
  display: null
};

export default (state = INITIAL_STATE, action: any) => {
  console.log("==========>", action.type, "<==========");
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
        imported: action.payload
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
        uploading: false
      };
    case ACCOUNT_UPLOAD_FAILURE:
      return {
        ...state,
        uploading: false
      };
    case ACCOUNT_ADD_IMAGE:
      return {
        ...state,
        images: action.payload
      };
    case ACCOUNT_DISPLAY_IMAGE:
      return {
        ...state,
        display: action.payload
      };
    case ACCOUNT_HIDE_IMAGE:
      return {
        ...state,
        display: null
      };
    default:
      return state;
  }
};
