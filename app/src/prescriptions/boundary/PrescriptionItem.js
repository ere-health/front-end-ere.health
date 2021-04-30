import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";

class Prescription extends BElement {
    
    extractState({prescriptions: {list}}) {
        return list[window.location.pathname.split("/").pop()];
    }

    view() {
        const prescription = this.state;
        let patient = prescription.entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0];
        let name = patient.resource && patient.resource.name ? patient.resource.name[0] : {"given": [], "family": ""};
        let displayName = name.given.join(" ")+" "+name.family;
        
        return html`
              <div class="recipe-wrapper active" id="unsigned_1">
                
                <div class="title-rezept-button">
                    <h2>Rezept für <strong>${displayName}</strong></h2>
                    <button data-modal-target="#modal" class="open-modal jet-btn">Rezept jetzt signieren</button>
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
                                        <label for="name">Krankenkasse bzw. Kostenträger</label>
                                        <input type="text" name="name" id="name" placeholder="AOK Rheinland-Pfalz">
                                    </div>
                                </div>

                                <div class="column-2 border-bottom">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="address1">Name, Vorname des Versicherten</label>
                                            <textarea style="max-width: 160px; min-height: 75px;" name="address" id="address1" cols="10" placeholder="Isabella Bowers, Heidestraße 17, 51147 Köln"></textarea>
                                            <span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="geb1">geb. am</label>
                                            <input type="text" name="geb" id="geb1" placeholder="12.08.1964">
                                        </div>
                                    </div>
                                </div>

                                <div class="column-3 border-bottom">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Kostenträgerkennung1">Kostenträgerkennung</label>
                                            <input type="text" name="Kostenträgerkennung" id="Kostenträgerkennung1" class="bright" placeholder="100038825">
                                            <span></span>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="person1">Versicherten-Nr.</label>
                                            <input type="text" name="person1" id="address" class="bright" placeholder="Versicherten-Nr.">
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
                                            <label for="Betriebsstätten1">Betriebsstätten-Nr.</label>
                                            <input type="text" name="Betriebsstätten-Nr." id="Betriebsstätten1" class="bright" placeholder="Betriebsstätten-Nr.">
                                            <span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="doctor1">Arzt-Nr.</label>
                                            <input type="text" name="doctor-no" id="doctor1" class="bright" placeholder="LANR1234">
                                            <span></span>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="date1">Datum</label>
                                            <input type="text" id="date1" class="bright" name="date" placeholder="10.07.2021">
                                        </div>
                                    </div>
                                </div>

                                <div class="column-2 col-reverse">
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Unfalltag1">Unfalltag</label>
                                            <input type="text" name="Unfalltag" id="Unfalltag1" placeholder="-">
                                            <span class="long-border"></span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <div class="input-wrapper">
                                            <label for="Unfallbetrieb1">Unfallbetrieb oder Arbeitgebernr.</label>
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
                                <input type="text" class="drug-name" name="drug-1" id="drug-1" placeholder="Krankenkasse bzw. Kostenträger">
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