import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../../navigation";

const router = AppNavigator.router;
const mainNavAction = router.getActionForPathAndParams("Login");
const initialNavState = router.getStateForAction(mainNavAction);

export const NavReducer = (state = initialNavState, action) => {
  return router.getStateForAction(action, state);
};
