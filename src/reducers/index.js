import { combineReducers } from "redux";
import DateReducer from "./date_reducer";

const rootReducer = combineReducers({
  date: DateReducer
});

export default rootReducer;
