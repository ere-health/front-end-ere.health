
import { addPrescription } from "../../control/UnsignedPrescriptionControl.js";

class ServerWebSocketActionForwarder {
    constructor() {
        this.socket = new WebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");
        this.socket.onmessage = (event) => {
            console.log("ws", event)
            const eventData = JSON.parse(event.data);
            if(eventData.type === "Bundles") {
                this.processBundles(eventData.payload);
            }
        };
    }

    processBundles(bundles) {
        addPrescription(bundles);
    }
}

new ServerWebSocketActionForwarder();