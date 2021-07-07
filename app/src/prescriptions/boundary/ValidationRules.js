//https://github.com/mikeerickson/validatorjs#available-rules

export const MainWindowValidationRules = {
    //String
    'coverage-payor-display': ['required', 'regex:/^.{1,50}$/'],
    'medicationText': ['required', 'regex:/^.{1,50}$/'],
    'pzn': ['required', 'regex:/^[0-9]{6,8}$/'],
    'dosage-instructions': ['regex:/^.{1,30}$/'],
    'full-patient-address': ['required',
        'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20} ?[a-z A-ZäöüÄÖÜß\\-]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}, [0-9]{5} [a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],
    'organization-summary': ['required', 
    'regex:/^.*$/'],  
        // 'regex:/^([a-z A-ZäöüÄÖÜß\\-\\.]{1,20})? [a-z A-ZäöüÄÖÜß\\-]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, [0-9]{2} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, ([a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50})?, [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}, [0-9]{5} [a-z A-ZäöüÄÖÜß\\-]{1,32}, (\\+)?[0-9]{6,15}$/'],  

    //Numbers
    'betriebsstätten': ['required', 'regex:/^[0-9]{8,9}$/'],
    'kvid': ['required', 'regex:/^[a-zA-Z0-9]{10}$/'],
    'coverage-payor-iknr': ['required', 'regex:/^[0-9]{9}$/'],
    'doctor-number': ['required', 'regex:/^[0-9]{6,9}$/'],
    'wop': ['required', 'regex:/^[0-9]{1,2}$/'],

    //Dates, entered as DD.MM.YYYY but converted into YYYY-MM-DD for the bundle.
    'birthdate': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],
    'authoredOn': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}T00:00:00.000Z$/'],

    'Unfalltag': ['regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/']

};


export const PatientPopupValidationRules = {
    //String
    'patient-prefix': ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'patient-given': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'patient-family': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
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
    'practId-doctor-number': ['required', 'regex:/^[0-9]{6,9}$/']
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
    //AUF DEUTSCH BITTE :)
    'coverage-payor-display': {
        required: 'The insurance name must be present',
        regex: 'The insurance name must be between 1 and 50 characters long'
    },
    'medicationText': {
        required: 'The medication name must be present',
        regex: 'The medication name must be between 1 and 50 characters long'
    },
    'pzn' : {
        required: 'The pzn number must be present',
        regex: 'The pzn number must be between 6 and 8 numbers long'
    },
    'dosage-instructions' : {
        regex: 'The dosage instructions must be between 1 and 30 characters long'
    },
    'full-patient-address' :{
        required: "Please open the popup related to the patient's data to fill its details",
        regex: "The full patient address seems to be wrong, Please open the popup related to the patient's data to fill its details"
    },
    'organization-summary' :{
        required: "Please open the popup related to the organization's data to fill its details",
        regex: "The full organization details seems to be wrong, Please open the popup related to the organization's data to fill its details"
    },
    'betriebsstätten' :{
        required: "The id of the practitioner's company must be present",
        regex: "The id of the practitioner's company must be between 8 and 9 numbers long"
    },
    'kvid': {
        required: 'The kvid must be present',
        regex: 'The kvid must be 10 characters long and composed by numbers or common letters'
    },
    'coverage-payor-iknr': {
        required: 'The iknr must be present',
        regex: 'The iknr must be composed by 9 numbers'
    },
    'doctor-number': {
        required: 'The doctor number must be present',
        regex: 'The practitioner id must be between 6 and 8 numbers long'
    },
    'wop': {
        required: 'The WOP must be present',
        regex: 'The WOP must be 1 or 2 numbers long'
    },
    'birthdate': {
        required: 'The patient birthday must be present',
        regex: 'The patient birtday must be of format D(D).M(M).YYYY'
    },
    'authoredOn': {
        required: 'The prescription date must be present',
        regex: 'The prescription date must be of format D(D).M(M).YYYY'
    }
};

export const PatientPopupErrorMessages = {
    //AUF DEUTSCH BITTE :)
    'patient-prefix': {
        regex: "The patient name's prefix must be between 1 and 20 letters long and can only contain a - or a ."
    },
    'patient-given': {
        required: 'The patient first name must be present',
        regex: 'The patient first name must be between 1 and 50 letters long and can only contain a - or a .'
    },
    'patient-family': {
        required: 'The patient last name must be present',
        regex: 'The patient last name must be between 1 and 50 letters long and can only contain a - or a .'
    },
    'patient-street-name': {
        required: 'The patient street name must be present',
        regex: 'The patient street name must be between 1 and 50 characters long and can only contain letters, numbers, a - or a .'
    },
    'patient-street-number': {
        required: 'The patient street number must be present',
        regex: 'The patient street name must be between 1 and 10 characters long and can only contain letters, numbers, a - or a .'
    },
    'patient-city': {
        required: 'The patient city must be present',
        regex: 'The patient city must be between 1 and 32 letters long and can only contain a -'
    },
    'patient-postal-code': {
        required: 'The patient postal code must be present',
        regex: 'The patient postal code must be 5 numbers long'
    }
};

export const OrganizationPopupErrorMessages = {
    //AUF DEUTSCH BITTE :)
    'practitioner-prefix': {
        regex: "The practitioner name's prefix must be between 1 and 20 letters long and can only contain a - or a ."
    },
    'practitioner-given': {
        required: 'The practitioner first name must be present',
        regex: 'The practitioner first name must be between 1 and 50 letters long and can only contain a - or a .'
    },
    'practitioner-family': {
        required: 'The practitioner last name must be present',
        regex: 'The practitioner last name must be between 1 and 50 letters long and can only contain a - or a .'
    },
    'practitioner-qualification-text': {
        required: 'The practitioner qualification text must be present',
        regex: 'The practitioner qualification text must be between 1 and 50 letters long and can only contain a - or a .'
    },
    'organization-street-name': {
        required: 'The organization street name must be present',
        regex: 'The organization street name must be between 1 and 50 characters long and can only contain letters, numbers, a - or a .'
    },
    'organization-street-number': {
        required: 'The organization street number must be present',
        regex: 'The organization street name must be between 1 and 10 characters long and can only contain letters, numbers, a - or a .'
    },
    'organization-city': {
        required: 'The organization city must be present',
        regex: 'The organization city must be between 1 and 32 letters long and can only contain a -'
    },
    'organization-postal-code': {
        required: 'The organization postal code must be present',
        regex: 'The organization postal code must be 5 numbers long'
    },
    'organization-phone': {
        required: 'The organization phone number must be present',
        regex: 'The organization phone number must be between 6 and 15 numbers long'
    },
    'organization-name': {
        regex: 'The organization name must be between 1 and 50 characters long'
    }
};

export const ClinicPopupErrorMessages = {
    'clinic-betriebsstätten': {
        required: "The id of the practitioner's company must be present",
        regex: "The id of the practitioner's company must be between 8 and 9 numbers long"
    }
};

export const PractIdErrorMessages = {
    'practId-doctor-number': {
        required: "The practitioner id must be present",
        regex: 'The practitioner id must be between 6 and 8 numbers long'
    }
};

export const MedicPopupErrorMessages = {
    //AUF DEUTSCH BITTE :)
    'medic-medicationText': {
        required: 'The medication name must be present',
        regex: 'The medication name must be between 1 and 50 characters long'
    },
    'medic-pzn' : {
        required: 'The pzn number must be present',
        regex: 'The pzn number must be between 6 and 8 numbers long'
    },
    'medic-dosage-instructions' : {
        regex: 'The dosage instructions must be between 1 and 30 characters long'
    },
    'medic-quantity': {
        regex: 'The quantity of medication must be between 1 and 3 numbers long'
    }
};


export const PopupErrorMessages = {
    'organizationEdit': OrganizationPopupErrorMessages,
    'patientEdit': PatientPopupErrorMessages,
    'clinicEdit': ClinicPopupErrorMessages,
    'PractIdEdit': PractIdErrorMessages,
    'medicEdit': MedicPopupErrorMessages
};