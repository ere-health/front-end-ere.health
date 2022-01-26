import "../boundary/MedicationItemPopup.js";
import { openMedicationPopup } from "../control/MedicationItemControl.js";
import {
  buildFhirPzn,
  buildFhirFreeText
} from "../entity/MedicationItemType.js";

openMedicationPopup(
  buildFhirFreeText('0d93504e-c6a7-47c1-8ad5-b0c5cf1b8920',
                    'freitext',
                    'Metformin 850mg Tabletten N3')
  // buildFhirPzn('f568397d-7ba2-46ac-904b-02caec933b42',
  //              'N1',
  //              '08585997',
  //              'Prospan® Hustensaft 100ml N1',
  //              'FLE');
);
