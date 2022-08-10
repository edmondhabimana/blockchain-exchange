import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

/* Import Reducers*/
import { provider, tokens } from "./reducers";

const reducer = combineReducers({
  provider,
  tokens,
});

const initialState = {};

const middleware = { thunk };

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...Object.values(middleware)))
);

export default store;