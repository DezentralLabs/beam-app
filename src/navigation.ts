import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationNavigateAction,
  NavigationParams
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
  console.log("[navigation.ts] navigate => _navigator", _navigator);
  console.log("[navigation.ts] navigate => routeName", routeName);
  console.log("[navigation.ts] navigate => params", params);
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

export function goBack() {
  if (_navigator) {
    _navigator.dispatch(NavigationActions.back());
  }
}
