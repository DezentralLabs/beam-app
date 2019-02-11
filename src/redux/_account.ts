import { createWallet } from "../helpers/wallet";
import { selectFile, unzipFile, scanDirectory } from "../helpers/utils";
import { navigate } from "../navigation";
import { saveProfile } from "../helpers/asyncStorage";
import { loadWallet } from "../helpers/wallet";
import { getProfile } from "../helpers/asyncStorage";

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
    const images = await scanDirectory(resultPath);
    if (images && images.length) {
      console.log("images", images);
      dispatch({ type: ACCOUNT_IMPORT_SUCCESS, payload: images });
    } else {
      console.error("Failed to load images");
      dispatch({ type: ACCOUNT_IMPORT_FAILURE });
    }
  } catch (error) {
    console.error(error);
    dispatch({ type: ACCOUNT_IMPORT_FAILURE });
  }
};

// -- Reducer --------------------------------------------------------------- //
const IMPORTIAL_STATE = {
  initiating: false,
  loading: false,
  recoverSeedPhrase: "",
  username: "",
  address: "",
  images: [],
  account: {}
};

export default (state = IMPORTIAL_STATE, action: any) => {
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

    case ACCOUNT_IMPORT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACCOUNT_IMPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        images: action.payload
      };
    case ACCOUNT_IMPORT_FAILURE:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
