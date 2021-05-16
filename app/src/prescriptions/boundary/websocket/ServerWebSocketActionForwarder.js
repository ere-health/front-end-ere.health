
import { addPrescription } from "../../control/UnsignedPrescriptionControl.js";

class _ServerWebSocketActionForwarder {
    constructor() {
        this.socket = new WebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");
        this.socket.onmessage = (event) => {
            console.log("ws", event)
            const eventData = JSON.parse(event.data);
            if(eventData.type === "Bundles") {
                this.processBundles(eventData.payload);
            } else if(eventData.type === "Exception") {
                alert(JSON.stringify(eventData.payload));
            }
        };
    }

    processBundles(bundles) {
        addPrescription(bundles);
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }
}

const ServerWebSocketActionForwarder = new _ServerWebSocketActionForwarder();
export default ServerWebSocketActionForwarder;