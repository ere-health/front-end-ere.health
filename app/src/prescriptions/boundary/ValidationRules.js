//https://github.com/mikeerickson/validatorjs#available-rules

export const MainWindowValidationRules = {
    //String
    'coverage-payor-display': ['required', 'regex:/^.{1,50}$/'],
    'drug-1': ['required', 'regex:/^.{1,50}$/'],
    'pzn': ['required', 'regex:/^[0-9]{6,8}$/'],
    'dosage-instructions': ['regex:/^.{1,30}$/'],
    'full-patient-address': ['required',
        'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}? [a-z A-ZäöüÄÖÜß\\-]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.]{1,50}, [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50} [a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}, [0-9]{5} [a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],

    //Numbers
    'betriebsstätten': ['required', 'regex:/^[0-9]{8,9}$/'],
    'kvid': ['regex:/^[a-zA-Z0-9]{10}$/'],
    'coverage-payor-iknr': ['required', 'regex:/^[0-9]{9}$/'],
    'doctor-number': ['regex:/^[0-9]{6,9}$/'],
    'wop': ['regex:/^[0-9]{1,2}$/'],

    //Dates, we need to be DD.MM.YYYY
    'birthdate': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],
    'authoredOn': ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/']
};

export const MainWindowErrorMessages = {
    //AUF DEUTSCH BITTE :)
    'coverage-payor-display': {
        required: 'You need to enter an insurance name',
        regex: 'The insurance name must be between 1 and 50 characters long'
    }
};

export const PatientPopupValidationRules = {
    //String
    'patient-prefix': ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'patient-given': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,50}$/'],
    'patient-family': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'patient-street-name': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'patient-street-number': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}$/'],
    'patient-city': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],

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
}