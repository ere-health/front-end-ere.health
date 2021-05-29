//npm install @rollup/plugin-node-resolve --save-dev
//npm install @rollup/plugin-commonjs --save-dev

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [{
  input: [
    './node_modules/lit-html/lit-html.js',
    './node_modules/@vaadin/router/dist/vaadin-router.js',
    './node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js'
  ],
    output: { dir: "../", format: "esm" },
  plugins: [nodeResolve({
    browser: true
  }), commonjs()]
}, {
  input: [
    './node_modules/fhir/dist/bundle.js'
  ],
    output: { dir: "../", format: "esm"},
  plugins: [nodeResolve({
    browser: true
  }), commonjs()]
}]
