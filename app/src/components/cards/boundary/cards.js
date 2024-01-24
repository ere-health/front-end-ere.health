import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

import {
    selectCard,
    selectCardEHBA,
    selectCardSMCB,
    selectPin,
    loadCards,
    changePin,
    verifyPin,
    unblockPin
} from "../control/CardsControl.js";

class CardsSection extends BElement {

  extractState({cardsReducer}) {
    if(!cardsReducer.cards) {
      cardsReducer.cards = [];
    }
    if(!cardsReducer.selectedCard) {
      cardsReducer.selectedCard;
    }
    return cardsReducer;
  }

  onSelectCard(cardHandle) {
    selectCard(this.state.cards.filter(c => c.cardHandle === cardHandle)[0]);
  }

  onSelectCardSMCB(cardHandle) {
    selectCardSMCB(cardHandle);
  }

  onSelectCardEHBA(cardHandle) {
    selectCardEHBA(cardHandle);
  }

  onSelectPin(pin) {
    selectPin(pin);
  }

  onLoadCards(e) {
    e.preventDefault();
    loadCards();
  }

  onChangePin(e) {
    e.preventDefault();
    changePin();
  }

  onUnblockPin(e) {
    e.preventDefault();
    unblockPin();
  }

  onVerifyPin(e) {
    e.preventDefault();
    verifyPin();
  }

  view() {
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;">
        <label for="current-ehba">eHBA zum Signieren</label><br />
        <select id="current-ehba" style="
            height        : 56px;
            border-radius : 4px;
            border        : none;
            width         : 100%;
            font-family   : Quicksand;
            font-style    : normal;
            font-weight   : 500;
            font-size     : 18px;
            line-height   : 22px;
        "
        @change="${_ => this.onSelectCardEHBA(_.target.value)}"
        >
        <option value="" ?selected=${!this.state.selectedCardEHBA || this.state.selectedCardEHBA === ""}>Beliebigen EHBA</option>
        ${this.state.cards.filter(card => card.cardType == "HBA").map(card => {
            return html`<option value="${card.cardHandle}" ?selected=${this.state.selectedCardEHBA && this.state.selectedCardEHBA === card.cardHandle}>${card.cardType} ${card.cardHandle} ${card.cardHolderName}</option>`;
        })}
        </select>
        <label for="current-smc-b">SMC-B für den Fachdienstzugriff</label><br />
        <select id="current-smc-b" style="
            height        : 56px;
            border-radius : 4px;
            border        : none;
            width         : 100%;
            font-family   : Quicksand;
            font-style    : normal;
            font-weight   : 500;
            font-size     : 18px;
            line-height   : 22px;
        "
        @change="${_ => this.onSelectCardSMCB(_.target.value)}"
        >
        <option value="" ?selected=${!this.state.selectedCardSMCB || this.state.selectedCardSMCB === ""}>Beliebige SMC-B</option>
        ${this.state.cards.filter(card => card.cardType == "SMC_B").map(card => {
            return html`<option value="${card.cardHandle}" ?selected=${this.state.selectedCardSMCB && this.state.selectedCardSMCB === card.cardHandle}>${card.cardType} ${card.cardHandle} ${card.cardHolderName}</option>`;
        })}
        </select>
        <label for="current-cards">Karten</label><br />
        <select id="current-cards" style="
            height        : 56px;
            border-radius : 4px;
            border        : none;
            width         : 100%;
            font-family   : Quicksand;
            font-style    : normal;
            font-weight   : 500;
            font-size     : 18px;
            line-height   : 22px;
        "
        @change="${_ => this.onSelectCard(_.target.value)}"
        >
        ${this.state.cards.map(card => {
            return html`<option value="${card.cardHandle}" ?selected=${this.state.selectedCard.cardHandle === card.cardHandle}>${card.cardType} ${card.cardHandle} ${card.cardHolderName}</option>`;
        })}
        </select>
        <button 
            style="margin: 1rem 0;"                                                                  
            @click            = "${_ => this.onLoadCards(_)}"  
            class             = "jet-btn">
        Karten laden
        </button>
        <button 
            style="margin: 1rem 0;"                                                                  
            @click            = "${_ => this.onVerifyPin(_)}"
            ?disabled         = ${this.state.selectedCard.cardType != 'SMC_B'}
            class             = "jet-btn">
        Verify Pin
        </button>
        <label for="current-cards">Pin Typ</label><br />
        <select id="change-pin" style="
            height        : 56px;
            border-radius : 4px;
            border        : none;
            width         : 100%;
            font-family   : Quicksand;
            font-style    : normal;
            font-weight   : 500;
            font-size     : 18px;
            line-height   : 22px;
        "
        @change="${_ => this.onSelectPin(_.target.value)}"
        >
            <option value="PIN.CH">PIN.CH</option>
            <option value="PIN.QES">PIN.QES</option>
            <option value="PIN.SMC">PIN.SMC</option>
        </select>
        <button 
            style="margin: 1rem 0;"                                                                  
            @click            = "${_ => this.onChangePin(_)}"  
            class             = "jet-btn">
        PIN für gewählte Karte ändern
        </button>
        <button 
            style="margin: 1rem 0;"                                                                  
            @click            = "${_ => this.onUnblockPin(_)}"  
            class             = "jet-btn">
        PIN für gewählte Karte unblocken
        </button>
    </div>
    `;
  }
}

customElements.define('cards-section', CardsSection);