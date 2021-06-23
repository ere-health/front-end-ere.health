export function fixBundleMediosDemo(bundle) {
  //x = JSON.parse(localStorage.getItem("app.localstorage.control"))
  //x.prescriptions.list = x.prescriptions.list.filter(_ => _);
  //x.prescriptions.list.push(x.prescriptions.signedList.pop())
  //let bundle = x.prescriptions.list[0][0];
  //makeCompositionFirstEntryRule(bundle);
  //checkAuthoredOn(bundle);
  //checkPatientidentifierValue(bundle);
  //localStorage.setItem("app.localstorage.control", JSON.stringify(x))
}

function getEntry(bundle, name) {
  let medicationrequest = null;
  bundle.entry.forEach((_,idx) => {
    if (_.fullUrl.includes(name)) {
      medicationrequest = _;
    }
  });
  return medicationrequest;
}

function checkPatientidentifierValue(bundle) {
  const patient = getEntry(bundle, "Patient");
  if (!patient.resource.identifier[0].value) {
    patient.resource.identifier[0].value = "K030182229";
    console.info("Fixed missing patient.identifier[0].value");
  }
  //if (!patient.resource.birthDate) {
    patient.resource.birthDate= "1982-01-03"
    console.info("Fixed missing patient.identifier[0].value");
  //}
}

function checkAuthoredOn(bundle) {
  let medicationrequest = null;
  bundle.entry.forEach((_,idx) => {
    if (_.fullUrl.includes("MedicationRequest")) {
      medicationrequest = _;
    }
  });
  if (medicationrequest) {
    if (!medicationrequest.resource.authoredOn) { 
      medicationrequest.resource.authoredOn = "2021-04-01";
    }
    console.info("Fixed missing authoredOn");
  }
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
  localStorage.setItem("app.localstorage.control", JSON.stringify(x))
}
/*
x = JSON.parse(localStorage.getItem("app.localstorage.control"))
x.popupReducer.showPopup = ""
localStorage.setItem("app.localstorage.control", JSON.stringify(x))*/