import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

import {
    selectCard,
    selectPin,
    loadCards,
    changePin
} from "../control/CardsControl.js";

class CardsSection extends BElement {

  extractState({cardsReducer}) {
    if(!cardsReducer.cards) {
      cardsReducer.cards = [];
    }
    if(!cardsReducer.selecedCard) {
      cardsReducer.selecedCard;
    }
    return cardsReducer;
  }

  onSelectCard(card) {
    selectCard(card);
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

  view() {
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
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
        <label for="current-cards">Karten</label><br />
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
    </div>
    `;
  }
}

customElements.define('cards-section', CardsSection);