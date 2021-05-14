import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const addPrescriptionAction = createAction("addPrescriptionAction");
export const addPrescription = (prescription) => {
    store.dispatch(addPrescriptionAction(prescription));
}

export const selectPrescriptionAction = createAction("selectPrescriptionAction");
export const selectPrescription = (prescription) => {
    store.dispatch(selectPrescriptionAction(prescription));
}

export const signedPrescriptionAction = createAction("signedPrescriptionAction");
export const signedPrescription = (prescription) => {
    store.dispatch(signedPrescriptionAction(prescription));
}

export const updatePrescriptionAction = createAction("updatePrescriptionAction");
export const updatePrescription = (name, value) => {
    store.dispatch(updatePrescriptionAction({name, value}));
}

export const loadExamplesAction = createAction("loadExamplesAction");
export const loadExamples = async () => {
    const examples = ["0428d416-149e-48a4-977c-394887b3d85c.json", "14f3cff7-f921-429e-98ca-c65dcb367ba9.json", "15da065c-5b75-4acf-a2ba-1355de821d6e.json"];
    const prescriptions = await Promise.all(examples.map(url => fetch("assets/examples/"+url).then(o => o.json())))
    store.dispatch(loadExamplesAction(prescriptions));
}

