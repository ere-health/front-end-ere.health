import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { showPopupAll } from "../../../components/popup/control/PopupControl.js";

class MainLayout extends BElement {
  doClickId() {
    showPopupAll();
  }

  onRendered() {
    document.getElementById("pid2").onclick = () => this.doClickId();
  }
  view() {
    return html`
      <div class="main-content-wrapper">
        <header class="header-wrapper">
          <div class="header">
            <div class="logo">
              <a href="/html"
                ><img
                  src = "assets/images/ere.health-logo.svg"
                  alt = "Taleclinic Logo"
              /></a>
            </div>
            <div>
              <unsigned-prescription-list />
            </div>

            <div class="generated-pdf">
              <p>Erzeugte PDF’s</p>
              <previous-prescription-list />
            </div>

            <div class="jetzt-area">
              <p>
                <img src="assets/images/arrow-down.svg" alt="" /> Rezepte
                signieren und für Patienten direkt ausstellen.
              </p>
              <button data-modal-target="#modal" id="pid2" class="jet-btn">
                Jetzt alle Rezepte signieren
              </button>
            </div>
            <div>
              <load-examples />
            </div>
          </div>
        </header>

        <section class="recipe-body"></section>
        <!-- / Each patient items wrapper -->

        <prescription-popup />
      </div>
    `;
  }
}

customElements.define("main-layout", MainLayout);
