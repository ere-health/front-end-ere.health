//https://github.com/mikeerickson/validatorjs#available-rules

export const MainWindowValidationRules = {
    //String
    'coverage-payor-display' : ['required', 'regex:/^.{1,50}$/'],
    'drug-1' : ['required', 'regex:/^.{1,50}$/'],
    'pzn': ['required', 'regex:/^[0-9]{6,8}$/'],
    'dosage-instructions' :  ['regex:/^.{1,30}$/'],
    // 'full-address': ['required', ]

    //Numbers
    'betriebsstätten': ['required', 'regex:/^[0-9]{8,9}$/'],
    'kvid': ['regex:/^[a-zA-Z0-9]{10}$/'],
    'coverage-payor-iknr': ['required', 'regex:/^[0-9]{9}$/'],
    'doctor-number': ['regex:/^[0-9]{6,9}$/'],
    'wop' : ['regex:/^[0-9]{1,2}$/'],

    //Dates, we need to be DD.MM.YYYY
    'birthdate' : ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/'],
    'authoredOn' : ['required', 'regex:/^[0-9]{4}\\-[0-9]{1,2}\\-[0-9]{1,2}$/']
};

export const PatientPopupValidationRules = {
    //String
    'patient-prefix' : ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'patient-given' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,50}$/'],
    'patient-family' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'patient-street-name' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'patient-city' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],
    'patient-street-number': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}$/'],

    //Numbers
    'patient-postal-code': ['required', 'regex:/^[0-9]{5}$/']
};

export const OrganizationPopupValidationRules = {
    //String
    'practitioner-prefix' : ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,20}$/'],
    'practitioner-given' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,50}$/'],
    'practitioner-family' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'practitioner-qualification-text' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.]{1,50}$/'],
    'organization-name' : ['regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'organization-street-name' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,50}$/'],
    'organization-city' : ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-]{1,32}$/'],
    'organization-street-number': ['required', 'regex:/^[a-z A-ZäöüÄÖÜß\\-\\.0-9]{1,10}$/'],

    //Numbers
    'organization-postal-code': ['required', 'regex:/^[0-9]{5}$/'],
    'organization-phone' : ['required', 'regex:/^\\+?[0-9]{6,15}$/']
};

export const PopupRules = {
    'organizationEdit': OrganizationPopupValidationRules,
    'patientEdit' : PatientPopupValidationRules
}