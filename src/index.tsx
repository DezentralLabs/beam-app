import * as React from "react";
import { YellowBox } from "react-native";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead."
]);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
