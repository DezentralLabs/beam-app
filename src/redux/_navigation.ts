import {
  NavigationActions,
  NavigationNavigateActionPayload
} from "react-navigation";
import { createNavigationReducer } from "react-navigation-redux-helpers";
import AppNavigator from "../screens";

export const navigate = (options: NavigationNavigateActionPayload) => async (
  dispatch: any
) => {
  const navigateAction = NavigationActions.navigate(options);

  dispatch(navigateAction);
};

const navigation = createNavigationReducer(AppNavigator);

export default navigation;
