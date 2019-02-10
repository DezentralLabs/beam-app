import { connect } from "react-redux";
import { createReduxContainer } from "react-navigation-redux-helpers";
import AppNavigator from "./screens";

const AppReduxContainer = createReduxContainer(AppNavigator, "root");

const mapStateToProps = (state: any) => ({
  state: state.navigation
});

const App = connect(mapStateToProps)(AppReduxContainer);

export default App;
