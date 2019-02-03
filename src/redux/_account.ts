import { createEthAccount } from "../helpers/eth-crypto";
import { selectFile, unzipFile, scanDirectory } from "../helpers/utils";

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_CREATE_NEW = "account/ACCOUNT_CREATE_NEW";

const ACCOUNT_RECOVERY_REQUEST = "account/ACCOUNT_RECOVERY_REQUEST";
const ACCOUNT_RECOVERY_SUCCESS = "account/ACCOUNT_RECOVERY_SUCCESS";
const ACCOUNT_RECOVERY_FAILURE = "account/ACCOUNT_RECOVERY_FAILURE";

const ACCOUNT_IMPORT_REQUEST = "account/ACCOUNT_IMPORT_REQUEST";
const ACCOUNT_IMPORT_SUCCESS = "account/ACCOUNT_IMPORT_SUCCESS";
const ACCOUNT_IMPORT_FAILURE = "account/ACCOUNT_IMPORT_FAILURE";

// -- Actions --------------------------------------------------------------- //

export const accountCreateNew = () => (dispatch: any) => {
  const account = createEthAccount();
  dispatch({ type: ACCOUNT_CREATE_NEW, payload: account });
};

export const accountRecovery = () => (dispatch: any) => {
  dispatch({ type: ACCOUNT_IMPORT_REQUEST });
  try {
    dispatch({ type: ACCOUNT_IMPORT_SUCCESS });
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
  loading: false,
  images: [],
  account: {}
};

export default (state = IMPORTIAL_STATE, action: any) => {
  switch (action.type) {
    case ACCOUNT_CREATE_NEW:
      return {
        ...state,
        account: action.payload
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

    default:
      return state;
  }
};
