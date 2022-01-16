//https://github.com/mikeerickson/validatorjs#available-rules

export const MainWindowValidationRules = {
    //String
    'coverage-payor-display': ['required', 'regex:/^.{1,50}$/'],
    
    'medicationText-0': ['required', 'regex:/^.{1,1048576}$/'],
    'pzn-0': ['required', 'regex:/((^[0-9]{6,8}$)|(^freitext$)|(^wirkstoff$))/'],
    'dosage-instructions-0': ['regex:/^.{1,30}$/'],
    
    'full-patient-address': ['required',
        'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{0,20} ?[a-z A-ZäöüÄÖÜß\'\\-]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}, [0-9]{5} [a-z A-ZäöüÄÖÜß\\-\\.]{1,32}$/'],
    'organization-summary': ['required', 
    'regex:/^.*$/'],  
        // 'regex:/^([a-z A-ZäöüÄÖÜß\\-\\.]{1,20})? [a-z A-ZäöüÄÖÜß\\-]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, [0-9]{2} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, ([a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50})?, [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}, [0-9]{5} [a-z A-ZäöüÄÖÜß\\-]{1,32}, (\\+)?[0-9]{6,15}$/'],  

    //Numbers
    'betriebsstätten': ['required', 'regex:/^[0-9]{8,9}$/'],
    'kvid': ['required', 'regex:/^[a-zA-Z0-9]{10}$/'],
    'coverage-payor-iknr': ['required', 'regex:/^[0-9]{9}$/'],
    'doctor-number': ['required', 'regex:/^[0-9]{9}$/'],
    'wop': ['regex:/^[0-9]{1,2}$/'],

    //Dates, entered as DD.MM.YYYY but converted into YYYY-MM-DD for the bundle.
    'birthdate': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],
    'authoredOn': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],

    'unfalltag': ['regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],
    'noctu': [],
    'unfallbetrieb': [],

};


export const PatientPopupValidationRules = {
    //String
    'patient-prefix': ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'patient-given': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'patient-family': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\'\\-\\.]{1,50}$/'],
    'patient-street-name': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'patient-street-number': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}$/'],
    'patient-city': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],
    'patient-street-additional': [],

    //Numbers
    'patient-postal-code': ['required', 'regex:/^[0-9]{5}$/']
};


export const OrganizationPopupValidationRules = {
    //String
    'practitioner-prefix': ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'practitioner-given': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,50}$/'],
    'practitioner-family': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'practitioner-qualification-text': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'organization-name': ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'organization-street-name': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'organization-street-additional': [],
    'organization-city': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],
    'organization-street-number': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}$/'],

    //Numbers
    'organization-postal-code': ['required', 'regex:/^[0-9]{5}$/'],
    'organization-phone': ['required', 'regex:/^\\+?[0-9]{6,15}$/']
};


export const ClinicPopupValidationRules = {
    //Numbers, copy of MainWindows value
    'clinic-betriebsstätten': ['required', 'regex:/^[0-9]{8,9}$/']
};

export const PractIdPopupValidationRules = {
    //Numbers, copy of MainWindows value
    'practId-doctor-number': ['required', 'regex:/^[0-9]{9}$/']
};

export const MedicPopupValidationRules = {
    //String, copy of MainWindows value
    'medic-medicationText': ['required', 'regex:/^.{1,50}$/'],
    'medic-pzn': ['required', 'regex:/^[0-9]{6,8}$/'],
    'medic-dosage-instructions': ['regex:/^.{1,30}$/'],

    //Number
    'medic-quantity': ['regex:/^[0-9]{1,3}$/']
};

export const PopupRules = {
    'organizationEdit': OrganizationPopupValidationRules,
    'patientEdit': PatientPopupValidationRules,
    'clinicEdit': ClinicPopupValidationRules,
    'PractIdEdit': PractIdPopupValidationRules,
    'medicEdit': MedicPopupValidationRules
};


export const MainWindowErrorMessages = {
    'coverage-payor-display': {
        required: 'Es muss eine Versicherung angegeben werden',
        regex: 'Der Name der Versicherung muss zwischen 1 und 50 Zeichen lang sein'
    },
    'medicationText': {
        required: 'Es muss ein Medikamentenname angegeben werden',
        regex: 'Der Medikamentenname muss zwischen 1 bis 50 Zeichen lang sein'
    },
    'pzn' : {
        required: 'Es muss eine PZN-Nummer angegbene werden',
        regex: 'Die PZN Nummer muss zwischen 6 und 8 Ziffern lang sein'
    },
    'dosage-instructions' : {
        regex: 'Die Dosierungsintruktions muss zwischen 1 und 30 Zeichen lang sein'
    },
    'full-patient-address' :{
        required: "Bitte öffnen Sie das Popup für die Patiendaten um diese zu ändern",
        regex: "Die Adressdaten des Patienten sind unvollständig. Bitte öffnen Sie das Popup für die Patiendaten um diese zu ändern"
    },
    'organization-summary' :{
        required: "Bitte öffnen Sie das Popup für die Organisationsdaten um diese zu ändern",
        regex: "Die Daten der Organisation sind unvollständig. Bitte öffnen Sie das Popup für die Organistion um diese zu ändern"
    },
    'betriebsstätten' :{
        required: "Es muss eine Betriebsstättennummer der Oraganisation angegeben werden",
        regex: "Die Betriebsstättennummer muss zwischen 8 und 9 Ziffern lang sein"
    },
    'kvid': {
        required: 'Es muss eine Krankenkassennummer angegeben werden',
        regex: 'Die Krankenkassennummer muss 10 Zeichen lang sein long und besteht aus einem Buchstaben und Ziffern'
    },
    'coverage-payor-iknr': {
        required: 'Die IK Nummer der Versucherung muss angegeben werden',
        regex: 'Die IK Nummer muss 9 Ziffern lang sein'
    },
    'doctor-number': {
        required: 'Die LANR  des Arztes oder 999999991 für  einen Zahnarzt muss angegeben werden',
        regex: 'Die LANR muss 9 Ziffern lang sein'
    },
    'wop': {
        regex: 'Das WOP muss 1 bis 2 Ziffern lang sein'
    },
    'birthdate': {
        required: 'Das Geburtsdatum des Patienten muss angegeben werden',
        regex: 'Das Geburtsdatum des Patienten muss das Format  D(D).M(M).YYYY haben'
    },
    'authoredOn': {
        required: 'Das Erstellungsdatum der Verordnung muss angegben werden',
        regex: 'Das Erstellungsdatum der Verordnung muss das Format D(D).M(M).YYYY haben'
    }
};

export const PatientPopupErrorMessages = {
    'patient-prefix': {
        regex: "Der Titel des Patienten muss zwischen 1 und 2 Buchstaben haben und nur a - z oder A - Z enthalten"
    },
    'patient-given': {
        required: 'Der Patient muss einen Vornamen haben',
        regex: 'Der Vorname des Patienten muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'patient-family': {
        required: 'Der Patient muss einen Nachnamen haben',
        regex: 'Der Nachname des Patienten muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'patient-street-name': {
        required: 'Der Patient muss eine Straße haben',
        regex: 'Die Straßen des Patienten muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'patient-street-number': {
        required: 'Der Patient muss eine Straßennummer haben',
        regex: 'Die Straßennummer des Patienten muss zwischen 1 und 10 Buchstaben haben und nur a - z, 0-  9 oder A - Z enthalten'
    },
    'patient-city': {
        required: 'Der Patient muss eine Stadt haben',
        regex: 'Die Stadt des Patienten muss zwischen 1 und 32 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'patient-postal-code': {
        required: 'Der Patient muss eine Postleizhal haben',
        regex: 'Die Postleizahl des Patienten muss auf 5 Ziffern stehen'
    }
};

export const OrganizationPopupErrorMessages = {
    'practitioner-prefix': {
        regex: "Der Titel des Arztes muss zwischen 1 und 20 Buchstaben haben und nur a - z oder A - Z enthalten"
    },
    'practitioner-given': {
        required: 'Der Arzt muss einen Vornamen haben',
        regex: 'Der Vorname des Arztes muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'practitioner-family': {
        required: 'Der Arzt muss einen Nachnamen haben',
        regex: 'Der Nachname des Arztes muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'practitioner-qualification-text': {
        required: 'Der Arzt muss eine Qualifizierung haben',
        regex: 'Die Qualifizierung des Arztes muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'organization-street-name': {
        required: 'Die Organisation muss eine Straße haben',
        regex: 'Die Straße der Organisation muss zwischen 1 und 50 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'organization-street-number': {
        required: 'Die Organisation muss eine Straßennummer haben',
        regex: 'Die Straßennummer der Organisation muss zwischen 1 und 10 Buchstaben haben und nur a - z, 0 - 9 oder A - Z enthalten'
    },
    'organization-city': {
        required: 'Die Organisation muss einen Ort haben',
        regex: 'Der Ort der Organisation muss zwischen 1 und 32 Buchstaben haben und nur a - z oder A - Z enthalten'
    },
    'organization-postal-code': {
        required: 'Die Organisation muss eine Postleitzahl haben',
        regex: 'Die Postleitzahl der Organisation muss aus genau 5 Ziffern bestehen'
    },
    'organization-phone': {
        required: 'Die Organisation muss eine Telefonnummer haben',
        regex: 'Die Telefonnummer der Organisation muss zwischen 6 bis 15 Ziffern lang sein'
    },
    'organization-name': {
        regex: 'Der Namen der Organisation muss zwischen 1 bis 50 Buchstaben haben'
    }
};

export const ClinicPopupErrorMessages = {
    'clinic-betriebsstätten': {
        required: "Die Betriebsstättennummer des Arztes muss angegeben werden",
        regex: "Die Betriebsstättennummer des Arztes muss zwischen 8 und 9 Ziffern lang sein"
    }
};

export const PractIdErrorMessages = {
    'practId-doctor-number': {
        required: "Die lebenslange Arztnummer des Arztes muss angegeben werden",
        regex: 'Die lebenslange Arztnummer des Arztes muss 9 Ziffern lang sein'
    }
};

export const MedicPopupErrorMessages = {
    'medic-medicationText': {
        required: 'Der Medikamentenname muss angegeben werden',
        regex: 'Der Medikamentenname muss zwischen 1 bis 50 Buchstaben lang sein'
    },
    'medic-pzn' : {
        required: 'Die PZN muss vorhanden sein',
        regex: 'Die PZN muss zwischen 6 und 8 Ziffern land sein'
    },
    'medic-dosage-instructions' : {
        regex: 'Die Dosierungsanweisung muss zwischen 1 bis 30 Buchstaben lang sein'
    },
    'medic-quantity': {
        regex: 'Die Anzahl des Medikaments muss zwischen 1 und 3 Ziffern lang sein'
    }
};


export const PopupErrorMessages = {
    'organizationEdit': OrganizationPopupErrorMessages,
    'patientEdit': PatientPopupErrorMessages,
    'clinicEdit': ClinicPopupErrorMessages,
    'PractIdEdit': PractIdErrorMessages,
    'medicEdit': MedicPopupErrorMessages
};