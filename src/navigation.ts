import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationNavigateAction,
  NavigationParams,
  NavigationBackActionPayload
} from "react-navigation";

let _navigator: NavigationContainerComponent | null;

export function setTopLevelNavigator(
  navigatorRef: NavigationContainerComponent | null
) {
  _navigator = navigatorRef;
}

export function navigate(
  routeName: string,
  params?: NavigationParams,
  action?: NavigationNavigateAction
) {
  if (_navigator) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName: routeName,
        params: params,
        action: action
      })
    );
  }
}

export function goBack(opts?: NavigationBackActionPayload) {
  if (_navigator) {
    _navigator.dispatch(NavigationActions.back(opts));
  }
}
