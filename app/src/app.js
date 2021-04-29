import { Router } from "./libs/vaadin-router.js";
import store from "./store.js";
import './prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js';

const outlet = document.querySelector('.recipe-body');
const router = new Router(outlet);
router.setRoutes([
  {path: '/',     component: 'prescription-empty'},
  {path: '/prescription/:prescription',  component: 'prescription-item'}
]);
