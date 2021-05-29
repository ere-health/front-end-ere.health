#!/bin/bash
npm install
rollup -c
cp node_modules/fhir/dist/bundle.js ../
