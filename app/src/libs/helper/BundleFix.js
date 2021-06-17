export function fixBundleMediosDemo(bundle) {
  makeCompositionFirstEntryRule(bundle);
}

function makeCompositionFirstEntryRule(bundle) {
  // Fix entry to put Composition at first place
  let compositionIndex = 0;
  bundle.entry.forEach((_,idx) => {
    if (_.fullUrl.includes("Composition")) {
      compositionIndex = idx;
    }
  })

  if (compositionIndex !== 0) {
    const compEntry = bundle.entry[compositionIndex];
    delete bundle.entry[compositionIndex];
    bundle.entry = bundle.entry.filter(_ => _);
    bundle.entry.unshift(compEntry);
    console.info("Fixed Composition order")
  }
}

function resetTest() {
  x = JSON.parse(localStorage.getItem("app.localstorage.control"))
  x.prescriptions.list.push(x.prescriptions.signedList.pop())
  localStorage.setItem("app.localstorage.control", JSON.stringify(temp1))
}