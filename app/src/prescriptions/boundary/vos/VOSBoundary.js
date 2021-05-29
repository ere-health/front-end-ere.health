import {addPrescription} from "../../control/UnsignedPrescriptionControl.js";

export default function loadVosBundleAndConvertToPrescriptionBundle(url) {
    fetch(url).then(r => r.text()).then(fhirXml => {
        /// TODO: import Fhir correctly
        const vosBundle = new Fhir.Fhir();
        vosBundle.objToXml(fhirXml);
        // TODO: convert vosBundle to ePrescription Bundle
        const eRezeptBundle = {};
        addPrescription([eRezeptBundle]);
    });
};