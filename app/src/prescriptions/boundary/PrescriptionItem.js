import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import {i18n, setLocale} from "../../libs/i18n/i18n.js";
import {showPopupId} from "../../components/popup/control/PopupControl.js";

function getFromRes(source, resourceType, key) {
    const resource = (source.entry.filter(oEntry => oEntry.resource.resourceType === resourceType)[0]).resource;
    if (typeof key === "string") {
        return resource[key] ?? "";
    }

    return key(resource);
}

class Prescription extends BElement {
    
    extractState({prescriptions: {list}}) {
        return list[window.location.pathname.split("/").pop()];
    }

    doClickId() {
        showPopupId();
    }

    onRendered() {
        document.getElementById("pid").onclick = () => this.doClickId();
    }

    view() {
        const prescription = this.state;       
        let displayName = getFromRes(prescription, "Patient", _ => {
            let name = _.name ? _.name[0] : {"given": [], "family": ""};
            return name.given.join(" ")+" "+name.family;
        })
        
        return html`
              <div class="recipe-wrapper active" id="unsigned_1">
                
                <div class="title-rezept-button">
                    <h2>${i18n("RecipeFor")} <strong>${displayName}</strong></h2>
                    <button id="pid" class="open-modal jet-btn">${i18n("SignRecipe")}</button>
                </div>

                <div class="art-info-form">
                    <div class="art">
                        <form action="" class="art-form">
                            <ul class="zet-check-list">
                                <div class="zet-title">Art</div>
                                <li class="art-list-item">
                                    <input type="checkbox" id="gebührenfrei" checked="checked" value="Gebührenfrei">
                                    <label for="gebührenfrei">Gebührenfrei</label>
                                    <span class="checkmark"></span>
                                </li>
                                <li class="art-list-item">
                                    <input type="checkbox" id="geb-pfl" value="Geb. -pfl.">
                                    <label for="geb-pfl">Geb. -pfl.</label>
                                    <span class="checkmark"></span>
                                </li>
                                <li class="art-list-item">
                                    <input type="checkbox" id="noctu" value="noctu">
                                    <label for="noctu">noctu</label>
                                    <span class="checkmark"></span>
                                </li>
                                <li class="art-list-item">
                                    <input type="checkbox" id="sonstige" value="Sonstige">
                                    <label for="sonstige">Sonstige</label>
                                    <span class="checkmark"></span>
                                </li>
                                <li class="art-list-item">
                                    <input type="checkbox" id="unfall"value="Unfall">
                                    <label for="unfall">Unfall</label>
                                    <span class="checkmark"></span>
                                </li>
                                <li class="art-list-item">
                                    <input type="checkbox" id="arbeitsunfall"value="Arbeitsunfall">
                                    <label for="arbeitsunfall">Arbeitsunfall</label>
                                    <span class="checkmark"></span>
                                </li>
                            </ul>

                            <div class="collect-information">
                                <div class="form-group border-bottom">
                                    <div class="input-wrapper">
                                        <label for="name">${i18n("HealthInsurance")}</label>
                                        <input type="text" name="name" id="name" placeholder="${getFromRes(prescription, "Coverage", _ => _.payor?.[0]?.display ?? "")}">
                                    </div>
                                </div>

                                <div class="column-2 border-bottom">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="address1">${i18n("Patient.Name")}</label>
                                            <textarea style="max-width: 230px; min-height: 75px;" name="address" id="address1" cols="10" placeholder="${displayName}, ${getFromRes(prescription, "Patient", _ => _.address?.[0]?.line?.[0] ?? "")}, ${getFromRes(prescription, "Patient", _ => _.address?.[0]?.city ?? "")}"></textarea>
                                            <span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="geb1">${i18n("Patient.Birth")}</label>
                                            <input type="text" name="geb" id="geb1" placeholder="${getFromRes(prescription, "Patient", _ => _.birthDate ?? "")}">
                                        </div>
                                    </div>
                                </div>

                                <div class="column-3 border-bottom">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Kostenträgerkennung1">${i18n("CostUnitId")}</label>
                                            <input type="text" name="Kostenträgerkennung" id="Kostenträgerkennung1" class="bright" placeholder="${getFromRes(prescription, "Coverage", _ => _.payor?.[0]?.identifier?.value ?? "")}">
                                            <span></span>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="person1">${i18n("InsuredPersNum")}</label>
                                            <input type="text" name="person1" id="address" class="bright" placeholder="${getFromRes(prescription, "Patient", _ => _.identifier?.[0]?.value ?? "")}">
                                            <span></span>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Status1">Status</label>
                                            <input type="text" name="Status" id="Status1" class="bright" placeholder="1000 1">
                                        </div>
                                    </div>
                                </div>

                                <div class="column-3 border-bottom">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Betriebsstätten1">${i18n("OperatingSiteNum")}</label>
                                            <input type="text" name="Betriebsstätten-Nr." id="Betriebsstätten1" class="bright" placeholder="${getFromRes(prescription, "Organization", _ => _.identifier?.[0]?.value ?? "")}">
                                            <span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="doctor1">${i18n("DoctorNum")}</label>
                                            <input type="text" name="doctor-no" id="doctor1" class="bright" placeholder="${getFromRes(prescription, "Practitioner", _ => _.identifier?.[0]?.value ?? "")}">
                                            <span></span>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="date1">${i18n("Date")}</label>
                                            <input type="text" id="date1" class="bright" name="date" placeholder="${getFromRes(prescription, "Composition", _ => new Date(_.date).toLocaleDateString())}">
                                        </div>
                                    </div>
                                </div>

                                <div class="column-2 col-reverse">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Unfalltag1">${i18n("AccidentDay")}</label>
                                            <input type="text" name="Unfalltag" id="Unfalltag1" placeholder="-">
                                            <span class="long-border"></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Unfallbetrieb1">${i18n("AccidentCompanyNum")}</label>
                                            <input type="text" id="Unfallbetrieb1" name="date" placeholder="-">
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </form>
                    </div>
                    <div class="user-info-box">
                        
                    </div>
                </div>

                <div class="drug-area">
                    <div class="inline">
                        <div class="zet-title first-col">Aut idem</div>
                        <div class="zet-title second-col">Medikament</div>
                        <div class="zet-title third-col">Dosierung</div>
                    </div>

                    <form action="" class="art-form">
                        <ul class="zet-check-list">
                            <li class="art-list-item">
                                <input type="text" class="drug-name" name="drug-1" id="drug-1" placeholder="${i18n("HealthInsurance")}">
                                <input type="text" class="duration" placeholder="1 / 1 / 1">
                                <span class="checkmark"></span>
                            </li>

                            <li class="art-list-item">
                                <input type="text" class="drug-name" name="drug-1" id="drug-1" placeholder="Methionin AL 500 Filmtabletten">
                                <input type="text" class="duration" placeholder="1 / 0 / 0">
                                <span class="checkmark"></span>
                            </li>

                            <li class="art-list-item">
                                <input type="text" class="drug-name" name="drug-1" id="drug-1" placeholder="Ibuprofen Heumann Schmerztabletten 600 m">
                                <input type="text" class="duration" placeholder="2 / 0 / 1">
                                <span class="checkmark"></span>
                            </li>

                        </ul>
                    </form>
                </div>

            </div> <!-- / Each patient item -->
        `;
    }
}
customElements.define('prescription-item', Prescription);