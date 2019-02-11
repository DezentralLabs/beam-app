import { createWallet } from "../helpers/wallet";
import { selectFile, unzipFile, scanDirectory } from "../helpers/utils";
import { navigate, goBack } from "../navigation";
import { saveProfile } from "../helpers/asyncStorage";
import { loadWallet } from "../helpers/wallet";
import { getProfile } from "../helpers/asyncStorage";
import { IFileJson } from "../helpers/types";
import { pinFile } from "../helpers/api";

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

const ACCOUNT_ADD_IMAGE = "account/ACCOUNT_ADD_IMAGE";

// -- Actions --------------------------------------------------------------- //

export const accountInit = () => async (dispatch: any) => {
  dispatch({ type: ACCOUNT_INIT_REQUEST });
  console.log(ACCOUNT_INIT_REQUEST);
  try {
    const account = await loadWallet();
    if (account) {
      const profile = await getProfile();
      const username = profile.username;
      console.log("[accountInit] account.address", account.address);
      console.log("[accountInit] profile.username", profile.username);
      dispatch({
        type: ACCOUNT_INIT_SUCCESS,
        payload: {
          account,
          username
        }
      });
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
    saveProfile({
      address: account.address,
      username: username
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
    const resultPath = await unzipFile(file.uri);
    const imported = await scanDirectory(resultPath);
    if (imported && imported.length) {
      console.log("imported", imported);
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
  const { selected } = getState().account;
  dispatch({ type: ACCOUNT_UPLOAD_REQUEST });
  try {
    goBack();
    await Promise.all(
      selected.map(async (fileJson: IFileJson) => {
        await pinFile(fileJson);
        dispatch(accountAddImage(fileJson));
      })
    );
    dispatch({ type: ACCOUNT_UPLOAD_SUCCESS });
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_UPLOAD_FAILURE });
  }
};

export const accountAddImage = (image: IFileJson) => async (
  dispatch: any,
  getState: any
) => {
  const prevImages = getState().account.images;
  const images = [...prevImages, image];
  dispatch({ type: ACCOUNT_ADD_IMAGE, payload: images });
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
  account: {}
};

export default (state = INITIAL_STATE, action: any) => {
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
        initiating: false
      };

    case ACCOUNT_UPDATE_USERNAME:
      console.log("action.type", action.type);
      console.log("action.payload", action.payload);
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
      console.log("action.type", action.type);
      console.log("action.payload", action.payload);
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
      console.log("action.type", action.type);
      console.log("action.payload", action.payload);
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
      console.log("action.type", action.type);
      console.log("action.payload", action.payload);
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
    default:
      return state;
  }
};
