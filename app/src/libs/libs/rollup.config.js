//npm install @rollup/plugin-node-resolve --save-dev

import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
  input: [
    './node_modules/lit-html/lit-html.js',
    './node_modules/@vaadin/router/dist/vaadin-router.js',
    './node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js',
    './node_modules/validatorjs/dist/validator.js'
  ],
    output: { dir: "../", format: "esm" },
  plugins: [nodeResolve({
    browser: true
  })]
}]
