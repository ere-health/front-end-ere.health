import * as bundle from "../../../libs/bundle.js";
import {addPrescription} from "../../control/UnsignedPrescriptionControl.js";

export default function loadVosBundleAndConvertToPrescriptionBundle(url) {
    fetch(url).then(r => r.text()).then(fhirXml => {
        /// TODO: import Fhir correctly
        const vosBundle = bundle.Fhir.xmlToObj(fhirXml);
        // TODO: convert vosBundle to ePrescription Bundle

        addPrescription([vosBundle]);
    });
};