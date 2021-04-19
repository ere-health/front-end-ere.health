import { configureStore } from "./libs/redux-toolkit.esm.js";
import { load } from "./localstorage/control/StorageControl.js";
import { prescriptions } from "./prescriptions/entity/PrescriptionsReducer.js"

const reducer = {
    prescriptions
}
const preloadedState = load();
const config = preloadedState ? { reducer, preloadedState } : {reducer};
const store = configureStore(config);
export default store;