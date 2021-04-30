import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

class MainLayout extends BElement{
    
  view() {
      return html`
      <div class="main-content-wrapper">
      <header class="header-wrapper">

          <div class="header">
              <div class="logo">
                  <a href="/html"><img src="assets/images/ere.health-logo.svg" alt="Taleclinic Logo"></a>
              </div>
              <div>
                <unsigned-prescription-list />
              </div>

              <div class="generated-pdf">

                  <p>Erzeugte PDF’s</p>
                  <div class="generated-list">
                      <button> <img src="assets/images/tik-.svg"> Joy Heather</button>
                      <button> <img src="assets/images/tik-.svg"> Mathias Robben</button>
                  </div>
              </div>

              <div class="jetzt-area">
                  <p> <img src="assets/images/arrow-down.svg" alt=""> Rezepte signieren und für Patienten direkt ausstellen.</p>
                  <button data-modal-target="#modal" class="jet-btn">Jetzt alle Rezepte signieren</button>
              </div>
              <div>
                <load-examples />
              </div>
          </div>

      </header>

      
      <section class="recipe-body">

    
      </section> <!-- / Each patient items wrapper -->

      <section class="popup">
          <div class="modal" id="modal">
              <div class="modal-title">
                  <p>Bitte legen Sie jetzt Ihren <strong>digitalen Arztausweis auf das Kartenlesegerät</strong> und geben Sie ihre Pin ein.</p>
              </div>
              <div class="modal-image"><img src="assets/images/popup-icon.png" alt="popup"></div>
              <div class="modal-buttons">
                  <button data-close-button class="cancel">Abbrechen</button>
                  <button data-modal-target-processing="#processing" class="ok-next">Ok, Weiter</button>
              </div>
          </div>

          <div class="modal" id="processing">
              <div class="modal-title">
                  <p>Arztausweis erkannt. <strong>Rezepte werden erzeugt. </strong>Bitte warten.</p>
              </div>
              <div class="modal-image"><img src="assets/images/popup-icon2.png" alt="popup"></div>
              <div class="modal-buttons">
                  <button data-modal-target-fatig="#fatig" class="grow-in-wealth">Bitte warten</button>
              </div>
          </div>

          <div class="modal" id="fatig">
              <div class="modal-title">
                  <p>Rezept erzeugt und <strong>an Patient versandt</strong></p>
              </div>
              <div class="modal-image"><img src="assets/images/popup-icon3.png" alt="popup"></div>
              <div class="modal-buttons">
                  <a href="./print.html" class="grow-in-wealth"> Fertig</a>
              </div>
          </div>
          <div id="overlay"></div>
      </section>

  </div>
      `;
  }
}

customElements.define('main-layout', MainLayout);