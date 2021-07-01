import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import {
  cancelPopupEditClinic,
  savePopupEditClinic,
  _hidePopup,
  cancelPopupEditPractId,
  savePopupEditPractId,
  savePopupEditMedikament,
  cancelPopupEditMedikament,
  addValidationErrorForCurrentPopup,
  removeValidationErrorForCurrentPopup,
  savePopupEditPatient,
  cancelPopupEditPatient,
  cancelPopupEditOrgaAction,
  cancelPopupEditOrga,
  savePopupEditOrga,
  ValidateAllFieldsInCurrentPopup
} from "../control/PopupControl.js";
import { Mapper } from "../../../libs/helper/Mapper.js";
import { updatePrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";


const FIELD_STATUS_VERSICHERTENART = [
  { value: "1", label: "Mitglieder" },
  { value: "3", label: "Familienangehoerige" },
  { value: "5", label: "Rentner" }
]

const FIELD_STATUS_BESONDERE = [
  { value: "00", label: "nicht gesetzt" },
  { value: "04", label: "SOZ" },
  { value: "06", label: "BVG" },
  { value: "07", label: "SVA1" },
  { value: "08", label: "SVA2" },
  { value: "09", label: "ASY" },
]

const FIELD_STATUS_ZUORDNUNG = [
  { value: "00", label: "nicht gesetzt" },
  { value: "01", label: "DM2" },
  { value: "02", label: "BRK" },
  { value: "03", label: "KHK" },
  { value: "04", label: "DM1" },
  { value: "05", label: "Asthma" },
  { value: "06", label: "COPD" },
  { value: "07", label: "HI" },
  { value: "08", label: "Depression" },
  { value: "09", label: "Rueckenschmerz" },
  { value: "10", label: "Rheuma" },
]

const FIELD_STATUS_STATUSKENNZEICHEN = [
  { value: "00", label: "ohne Ersatzverordnungskennzeichen" },
  { value: "01", label: "ASV-Kennzeichen" },
  { value: "04", label: "Entlassmanagement-Kennzeichen" },
  { value: "07", label: "TSS-Kennzeichen" },
  { value: "10", label: "nur Ersatzverordnungskennzeichen" },
  { value: "11", label: "ASV-Kennzeichen mit Ersatzverordnungskennzeichen" },
  { value: "14", label: "Entlassmanagement-Kennzeichen mit Ersatzverordnungskennzeichen" },
  { value: "17", label: "TSS-Kennzeichen mit Ersatzverordnungskennzeichen" }
];

const FIELD_CLINIC_TYPE = [
  { value: "BSNR", label: "Betriebsstättennummer" },
  { value: "KZVA", label: "KZV-Abrechnungsnummer" }
];

const FIELD_PRACTID_TYPE = [
  { value: "LANR", label: "Arztnummer" },
  { value: "ZANR", label: "Zahnarztnummer" }
];

const FIELD_NORMGROBE_TYPE = [
  { value: "KA", label: "Keine Angabe" },
  { value: "KTP", label: "Keine therapiegerechte Packungsgröße" },
  { value: "N1", label: "N1" },
  { value: "N2", label: "N2" },
  { value: "N3", label: "N3" },
  { value: "NB", label: "Nicht betroffen" },
  { value: "Sonstiges", label: "Sonstiges" }
];

//awk '{printf "{ value: \""$1"\", label: \""$1; $1 = ""; print " -" $0 "\" },"}'
const FIELD_DARREICH_TYPE = [
  { value: "AEO", label: "AEO - Ätherisches Öl" },
  { value: "AMP", label: "AMP - Ampullen" },
  { value: "APA", label: "APA - Ampullenpaare" },
  { value: "ASN", label: "ASN - Augen- und Nasensalbe" },
  { value: "ASO", label: "ASO - Augen- und Ohrensalbe" },
  { value: "ATO", label: "ATO - Augen- und Ohrentropfen" },
  { value: "ATR", label: "ATR - Augentropfen" },
  { value: "AUB", label: "AUB - Augenbad" },
  { value: "AUC", label: "AUC - Augencreme" },
  { value: "AUG", label: "AUG - Augengel" },
  { value: "AUS", label: "AUS - Augensalbe" },
  { value: "BAD", label: "BAD - Bad" },
  { value: "BAL", label: "BAL - Balsam" },
  { value: "BAN", label: "BAN - Bandage" },
  { value: "BEU", label: "BEU - Beutel" },
  { value: "BIN", label: "BIN - Binden" },
  { value: "BON", label: "BON - Bonbons" },
  { value: "BPL", label: "BPL - Basisplatte" },
  { value: "BRE", label: "BRE - Brei" },
  { value: "BTA", label: "BTA - Brausetabletten" },
  { value: "CRE", label: "CRE - Creme" },
  { value: "DFL", label: "DFL - Durchstechflaschen" },
  { value: "DIG", label: "DIG - Digitale Gesundheitsanwendungen" },
  { value: "DIL", label: "DIL - Dilution" },
  { value: "DIS", label: "DIS - Depot-Injektionssuspension" },
  { value: "DKA", label: "DKA - Dragees in Kalenderpackung" },
  { value: "DOS", label: "DOS - Dosieraerosol" },
  { value: "DRA", label: "DRA - Dragees" },
  { value: "DRM", label: "DRM - Dragees magensaftresistent" },
  { value: "DSC", label: "DSC - Dosierschaum" },
  { value: "DSS", label: "DSS - Dosierspray" },
  { value: "EDP", label: "EDP - Einzeldosis-Pipetten" },
  { value: "EIN", label: "EIN - Einreibung" },
  { value: "ELE", label: "ELE - Elektroden" },
  { value: "ELI", label: "ELI - Elixier" },
  { value: "EMU", label: "EMU - Emulsion" },
  { value: "ESS", label: "ESS - Essenz" },
  { value: "ESU", label: "ESU - Erwachsenen-Suppositorien" },
  { value: "EXT", label: "EXT - Extrakt" },
  { value: "FBE", label: "FBE - Filterbeutel" },
  { value: "FBW", label: "FBW - Franzbranntwein" },
  { value: "FDA", label: "FDA - Filmdragees" },
  { value: "FER", label: "FER - Fertigspritzen" },
  { value: "FET", label: "FET - Fettsalbe" },
  { value: "FLA", label: "FLA - Flasche" },
  { value: "FLE", label: "FLE - Flüssigkeit zum Einnehmen" },
  { value: "FLU", label: "FLU - Flüssig" },
  { value: "FMR", label: "FMR - Filmtabletten magensaftresistent" },
  { value: "FOL", label: "FOL - Folie" },
  { value: "FRB", label: "FRB - Beutel mit retardierten Filmtabletten" },
  { value: "FSE", label: "FSE - Flüssigseife" },
  { value: "FTA", label: "FTA - Filmtabletten" },
  { value: "GEK", label: "GEK - Granulat zur Entnahme aus Kapseln" },
  { value: "GEL", label: "GEL - Gel" },
  { value: "GLI", label: "GLI - Gas und Lösungsmittel zur Herstellung einer Injektions-/Infusionsdispersion" },
  { value: "GLO", label: "GLO - Globuli" },
  { value: "GMR", label: "GMR - Magensaftresistentes Granulat" },
  { value: "GPA", label: "GPA - Gelplatte" },
  { value: "GRA", label: "GRA - Granulat" },
  { value: "GSE", label: "GSE - Granulat zur Herstellung einer Suspension zum Einnehmen" },
  { value: "GUL", label: "GUL - Gurgellösung" },
  { value: "HAS", label: "HAS - Handschuhe" },
  { value: "HKM", label: "HKM - Magensaftresistente Hartkapseln" },
  { value: "HKP", label: "HKP - Hartkapseln" },
  { value: "HPI", label: "HPI - Hartkapseln mit Pulver zur Inhalation" },
  { value: "HVW", label: "HVW - Hartkapseln mit veränderter Wirkstofffreisetzung" },
  { value: "IFA", label: "IFA - Infusionsampullen" },
  { value: "IFB", label: "IFB - Infusionsbeutel" },
  { value: "IFD", label: "IFD - Infusionsdispersion" },
  { value: "IFE", label: "IFE - Injektionslösung in einer Fertigspritze" },
  { value: "IFF", label: "IFF - Infusionsflaschen" },
  { value: "IFK", label: "IFK - Infusionslösungskonzentrat" },
  { value: "IFL", label: "IFL - Injektionsflaschen" },
  { value: "IFS", label: "IFS - Infusionsset" },
  { value: "IHA", label: "IHA - Inhalationsampullen" },
  { value: "IHP", label: "IHP - Inhalationspulver" },
  { value: "IIE", label: "IIE - Injektions- oder Infusionslösung oder Lösung zum Einnehmen" },
  { value: "IIL", label: "IIL - Injektions-, Infusionslösung" },
  { value: "IIM", label: "IIM - Injektionslösung zur intramuskulären Anwendung" },
  { value: "IKA", label: "IKA - Inhalationskapseln" },
  { value: "ILO", label: "ILO - Injektionslösung" },
  { value: "IMP", label: "IMP - Implantat" },
  { value: "INF", label: "INF - Infusionslösung" },
  { value: "INH", label: "INH - Inhalat" },
  { value: "INI", label: "INI - Injektions-, Infusionsflaschen" },
  { value: "INL", label: "INL - Inhalationslösung" },
  { value: "INS", label: "INS - Instant-Tee" },
  { value: "IST", label: "IST - Instillation" },
  { value: "ISU", label: "ISU - Injektionssuspension" },
  { value: "IUP", label: "IUP - Intrauterinpessar" },
  { value: "KAN", label: "KAN - Kanülen" },
  { value: "KAP", label: "KAP - Kapseln" },
  { value: "KAT", label: "KAT - Katheter" },
  { value: "KDA", label: "KDA - Kaudragees" },
  { value: "KEG", label: "KEG - Kegel" },
  { value: "KER", label: "KER - Kerne" },
  { value: "KGU", label: "KGU - Kaugummi" },
  { value: "KID", label: "KID - Konzentrat zur Herstellung einer Infusionsdispersion" },
  { value: "KII", label: "KII - Konzentrat zur Herstellung einer Injektions- oder Infusionslösung" },
  { value: "KKS", label: "KKS - Kleinkinder-Suppositorien" },
  { value: "KLI", label: "KLI - Klistiere" },
  { value: "KLT", label: "KLT - Klistier-Tabletten" },
  { value: "KMP", label: "KMP - Hartkapseln mit magensaftresistent überzogenen Pellets" },
  { value: "KMR", label: "KMR - Kapseln magensaftresistent" },
  { value: "KOD", label: "KOD - Kondome" },
  { value: "KOM", label: "KOM - Kompressen" },
  { value: "KON", label: "KON - Konzentrat" },
  { value: "KPG", label: "KPG - Kombipackung" },
  { value: "KRI", label: "KRI - Kristallsuspension" },
  { value: "KSS", label: "KSS - Kinder- und Säuglings-Suppositorien" },
  { value: "KSU", label: "KSU - Kinder-Suppositorien" },
  { value: "KTA", label: "KTA - Kautabletten" },
  { value: "LAN", label: "LAN - Lanzetten" },
  { value: "LII", label: "LII - Lösung zur Injektion, Infusion und Inhalation" },
  { value: "LIQ", label: "LIQ - Liquidum" },
  { value: "LOE", label: "LOE - Lösung" },
  { value: "LOT", label: "LOT - Lotion" },
  { value: "LOV", label: "LOV - Lösung für einen Vernebler" },
  { value: "LSE", label: "LSE - Lösung zum Einnehmen" },
  { value: "LTA", label: "LTA - Lacktabletten" },
  { value: "LUP", label: "LUP - Lutschpastillen" },
  { value: "LUT", label: "LUT - Lutschtabletten" },
  { value: "MIL", label: "MIL - Milch" },
  { value: "MIS", label: "MIS - Mischung" },
  { value: "MIX", label: "MIX - Mixtur" },
  { value: "MRG", label: "MRG - Magensaftresistentes Retardgranulat" },
  { value: "MRP", label: "MRP - Magensaftresistente Pellets" },
  { value: "MTA", label: "MTA - Manteltabletten" },
  { value: "MUW", label: "MUW - Mundwasser" },
  { value: "NAG", label: "NAG - Nasengel" },
  { value: "NAO", label: "NAO - Nasenöl" },
  { value: "NAS", label: "NAS - Nasenspray" },
  { value: "NAW", label: "NAW - Wirkstoffhaltiger Nagellack" },
  { value: "NDS", label: "NDS - Nasendosierspray" },
  { value: "NSA", label: "NSA - Nasensalbe" },
  { value: "NTR", label: "NTR - Nasentropfen" },
  { value: "OCU", label: "OCU - Ocusert" },
  { value: "OEL", label: "OEL - Öl" },
  { value: "OHT", label: "OHT - Ohrentropfen" },
  { value: "OVU", label: "OVU - Ovula" },
  { value: "PAM", label: "PAM - Packungsmasse" },
  { value: "PAS", label: "PAS - Pastillen" },
  { value: "PEL", label: "PEL - Pellets" },
  { value: "PEN", label: "PEN - Injektionslösung in einem Fertigpen" },
  { value: "PER", label: "PER - Perlen" },
  { value: "PFL", label: "PFL - Pflaster" },
  { value: "PFT", label: "PFT - Pflaster transdermal" },
  { value: "PHI", label: "PHI - Pulver zur Herstellung einer Injektions-, Infusions- oder Inhalationslösung" },
  { value: "PHV", label: "PHV - Pulver zur Herstellung einer Injektions- bzw. Infusionslösung oder Pulver und Lösungsmittel zur Herstellung einer Lösung zur intravesikalen Anwendung" },
  { value: "PIE", label: "PIE - Pulver für ein Konzentrat zur Herstellung einer Infusionslösung, Pulver zur Herstellung einer Lösung zum Einnehmen" },
  { value: "PIF", label: "PIF - Pulver für ein Konzentrat zur Herstellung einer Infusionslösung, Pulver zur Herstellung einer Lösung zum Einnehmen" },
  { value: "PII", label: "PII - Pulver zur Herstellung einer Injektions- oder Infusionslösung" },
  { value: "PIJ", label: "PIJ - Pulver zur Herstellung einer Injektionslösung" },
  { value: "PIK", label: "PIK - Pulver zur Herstellung eines Infusionslösungskonzentrates" },
  { value: "PIS", label: "PIS - Pulver zur Herstellung einer Infusionssuspension" },
  { value: "PIV", label: "PIV - Pulver zur Herstellung einer Injektions- bzw. Infusionslösung oder einer Lösung zur intravesikalen Anwendung" },
  { value: "PKI", label: "PKI - Pulver für ein Konzentrat zur Herstellung einer Infusionslösung" },
  { value: "PLE", label: "PLE - Pulver zur Herstellung einer Lösung zum Einnehmen" },
  { value: "PLF", label: "PLF - Pulver und Lösungsmittel zur Herstellung einer Infusionslösung" },
  { value: "PLG", label: "PLG - Perlongetten" },
  { value: "PLH", label: "PLH - Pulver und Lösungsmittel zur Herstellung einer Injektions- bzw. Infusionslösung" },
  { value: "PLI", label: "PLI - Pulver und Lösungsmittel zur Herstellung einer Injektionslösung" },
  { value: "PLK", label: "PLK - Pulver und Lösungsmittel für ein Konzentrat zur Herstellung einer Infusionslösung" },
  { value: "PLS", label: "PLS - Pulver und Lösungsmittel zur Herstellung einer Injektionssuspension" },
  { value: "PLV", label: "PLV - Pulver und Lösungsmittel zur Herstellung einer Lösung zur intravesikalen Anwendung" },
  { value: "PPL", label: "PPL - Pumplösung" },
  { value: "PRS", label: "PRS - Presslinge" },
  { value: "PSE", label: "PSE - Pulver zur Herstellung einer Suspension zum Einnehmen" },
  { value: "PST", label: "PST - Paste" },
  { value: "PUD", label: "PUD - Puder" },
  { value: "PUL", label: "PUL - Pulver" },
  { value: "RED", label: "RED - Retard-Dragees" },
  { value: "REK", label: "REK - Retard-Kapseln" },
  { value: "RET", label: "RET - Retard-Tabletten" },
  { value: "RGR", label: "RGR - Retard-Granulat" },
  { value: "RKA", label: "RKA - Retard-Kapseln" },
  { value: "RMS", label: "RMS - Retardmikrokapseln und Suspensionsmittel" },
  { value: "RSC", label: "RSC - Rektalschaum" },
  { value: "RSU", label: "RSU - Rektalsuspension" },
  { value: "RUT", label: "RUT - Retard-überzogene Tabletten" },
  { value: "SAF", label: "SAF - Saft" },
  { value: "SAL", label: "SAL - Salbe" },
  { value: "SAM", label: "SAM - Salbe zur Anwendung in der Mundhöhle" },
  { value: "SCH", label: "SCH - Schaum" },
  { value: "SEI", label: "SEI - Seife" },
  { value: "SHA", label: "SHA - Shampoo" },
  { value: "SIR", label: "SIR - Sirup" },
  { value: "SLZ", label: "SLZ - Salz" },
  { value: "SMF", label: "SMF - Schmelzfilm" },
  { value: "SMT", label: "SMT - Schmelztabletten" },
  { value: "SMU", label: "SMU - Suppositorien mit Mulleinlage" },
  { value: "SPA", label: "SPA - Spritzampullen" },
  { value: "SPF", label: "SPF - Sprühflasche" },
  { value: "SPL", label: "SPL - Spüllösung" },
  { value: "SPR", label: "SPR - Spray" },
  { value: "SPT", label: "SPT - Transdermales Spray" },
  { value: "SRI", label: "SRI - Spritzen" },
  { value: "SSU", label: "SSU - Säuglings-Suppositorien" },
  { value: "STA", label: "STA - Stechampullen" },
  { value: "STB", label: "STB - Stäbchen" },
  { value: "STI", label: "STI - Stifte" },
  { value: "STR", label: "STR - Streifen" },
  { value: "SUB", label: "SUB - Substanz" },
  { value: "SUE", label: "SUE - Suspension zum Einnehmen" },
  { value: "SUL", label: "SUL - Sublingualspray, Lösung" },
  { value: "SUP", label: "SUP - Suppositorien" },
  { value: "SUS", label: "SUS - Suspension" },
  { value: "SUT", label: "SUT - Sublingualtabletten" },
  { value: "SUV", label: "SUV - Suspension für einen Vernebler" },
  { value: "SWA", label: "SWA - Schwämme" },
  { value: "TAB", label: "TAB - Tabletten" },
  { value: "TAE", label: "TAE - Täfelchen" },
  { value: "TAM", label: "TAM - Trockenampullen" },
  { value: "TEE", label: "TEE - Tee" },
  { value: "TEI", label: "TEI - Tropfen zum Einnehmen" },
  { value: "TES", label: "TES - Test" },
  { value: "TIN", label: "TIN - Tinktur" },
  { value: "TKA", label: "TKA - Tabletten in Kalenderpackung" },
  { value: "TLE", label: "TLE - Tablette zur Herstellung einer Lösung zum Einnehmen" },
  { value: "TMR", label: "TMR - Tabletten magensaftresistent" },
  { value: "TON", label: "TON - Tonikum" },
  { value: "TPN", label: "TPN - Tampon" },
  { value: "TPO", label: "TPO - Tamponaden" },
  { value: "TRA", label: "TRA - Trinkampullen" },
  { value: "TRI", label: "TRI - Trituration" },
  { value: "TRO", label: "TRO - Tropfen" },
  { value: "TRS", label: "TRS - Trockensubstanz mit Lösungsmittel" },
  { value: "TRT", label: "TRT - Trinktabletten" },
  { value: "TSA", label: "TSA - Trockensaft" },
  { value: "TSD", label: "TSD - Tabletten zur Herstellung einer Suspension zum Einnehmen für einen Dosierspender" },
  { value: "TSE", label: "TSE - Tablette zur Herstellung einer Suspension zum Einnehmen" },
  { value: "TSS", label: "TSS - Trockensubstanz ohne Lösungsmittel" },
  { value: "TST", label: "TST - Teststäbchen" },
  { value: "TSY", label: "TSY - Transdermales System" },
  { value: "TTR", label: "TTR - Teststreifen" },
  { value: "TUB", label: "TUB - Tube" },
  { value: "TUE", label: "TUE - Tücher" },
  { value: "TUP", label: "TUP - Tupfer" },
  { value: "TVW", label: "TVW - Tablette mit veränderter Wirkstofffreisetzung" },
  { value: "UTA", label: "UTA - Überzogene Tabletten" },
  { value: "VAL", label: "VAL - Vaginallösung" },
  { value: "VAR", label: "VAR - Vaginalring" },
  { value: "VCR", label: "VCR - Vaginalcreme" },
  { value: "VER", label: "VER - Verband" },
  { value: "VGE", label: "VGE - Vaginalgel" },
  { value: "VKA", label: "VKA - Vaginalkapseln" },
  { value: "VLI", label: "VLI - Vlies" },
  { value: "VOV", label: "VOV - Vaginalovula" },
  { value: "VST", label: "VST - Vaginalstäbchen" },
  { value: "VSU", label: "VSU - Vaginalsuppositorien" },
  { value: "VTA", label: "VTA - Vaginaltabletten" },
  { value: "WAT", label: "WAT - Watte" },
  { value: "WGA", label: "WGA - Wundgaze" },
  { value: "WKA", label: "WKA - Weichkapseln" },
  { value: "WKM", label: "WKM - Magensaftresistente Weichkapseln" },
  { value: "WUE", label: "WUE - Würfel" },
  { value: "XDG", label: "XDG - Duschgel" },
  { value: "XDS", label: "XDS - Deo-Spray" },
  { value: "XFE", label: "XFE - Festiger" },
  { value: "XGM", label: "XGM - Gesichtsmaske" },
  { value: "XHA", label: "XHA - Halsband" },
  { value: "XHS", label: "XHS - Haarspülung" },
  { value: "XNC", label: "XNC - Nachtcreme" },
  { value: "XPK", label: "XPK - Körperpflege" },
  { value: "XTC", label: "XTC - Tagescreme" },
  { value: "ZAM", label: "ZAM - Zylinderampullen" },
  { value: "ZBU", label: "ZBU - Zahnbürste" },
  { value: "ZCR", label: "ZCR - Zahncreme" },
  { value: "ZGE", label: "ZGE - Zahngel" },
  { value: "ZKA", label: "ZKA - Zerbeisskapseln" },
  { value: "ZPA", label: "ZPA - Zahnpasta" }
];

const FIELD_PRACTQUALI_CODE = [
  { value: "00", label: "Arzt" },
  { value: "01", label: "Zahnarzt" },
  { value: "02", label: "Hebamme" },
  { value: "03", label: "Arzt in Weiterbildung" },
  { value: "04", label: "Arzt als Vertreter" },
]

export class BasePopup extends BElement {
  constructor() {
    super();
    this.id = "genPopup";
  }

  showPopup() {
    // Open selected popup
    const overlay = document.getElementById("overlayGen");
    const modal = document.querySelector("#" + this.id);
    addActiveClass(modal);
    addActiveClass(overlay);
  }

  hidePopup() {
    const overlay = document.getElementById("overlayGen");
    const modal = document.querySelector("#" + this.id);
    removeActiveClass(modal);
    removeActiveClass(overlay);
  }

  view() {
    //this.showPopup();
    return html`
      <section class="popup">
        <div class="modal" id="genPopup"></div>
        <div id="overlayGen" class="overlay"></div>
      </section>
    `;
  }
}

export class EditField extends BElement {
  constructor() {
    super();

    this.label = this.getAttribute('label');
    this.id = this.getAttribute('id');
    this.ratio = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  validateInput(name, value) {
    let data = new Object();
    let rule = new Object();
    let currentPopupName = "";

    if (this.id.startsWith('patient')) {
      currentPopupName = 'patientEdit';
    } else if ((this.id.startsWith('practitioner')) || (this.id.startsWith('organization'))) {
      currentPopupName = 'organizationEdit';
    } else if (this.id.startsWith('practId')) {
      currentPopupName = 'PractIdEdit';
    } else if (this.id.startsWith('clinic')) {
      currentPopupName = 'clinicEdit';
    } else if (this.id.startsWith('medic')) {
      currentPopupName = 'medicEdit';
    }

    data[name] = value;
    rule[name] = PopupRules[currentPopupName][name];

    return new Validator(data, rule, PopupErrorMessages[currentPopupName][name]);
  }

  onUserInput(label, value, key, statePath, useWindow, id) {
    let validation = this.validateInput(id, value);

    if (validation.passes()) {
      removeValidationErrorForCurrentPopup(id);
      updatePrescription(id, value, key, statePath, useWindow);

      if ((id.startsWith("clinic")) && ((document.getElementById("clinicEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("clinic-save-button").disabled = false;
      } else if ((id.startsWith("practId")) && ((document.getElementById("PractIdEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("practId-save-button").disabled = false;
      } else if ((id.startsWith("medic")) && ((document.getElementById("medicEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("medic-save-button").disabled = false;
      } else if ((id.startsWith("patient")) && ((document.getElementById("patientEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("patient-save-button").disabled = false;
      } else if ((id.startsWith("organization")) && ((document.getElementById("organizationEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("organization-save-button").disabled = false;
      }
    } else {
      addValidationErrorForCurrentPopup(id, validation.errors.get(id));

      if (id.startsWith("clinic")) {
        document.getElementById("clinic-save-button").disabled = true;
      } else if (id.startsWith("practId")) {
        document.getElementById("practId-save-button").disabled = true;
      } else if (id.startsWith("medic")) {
        document.getElementById("medic-save-button").disabled = true;
      } else if (id.startsWith("patient")) {
        document.getElementById("patient-save-button").disabled = true;
      } else if ((id.startsWith("organization")) || (id.startsWith("practitioner"))) {
        document.getElementById("organization-save-button").disabled = true;
      }
    }
  }

  view() {
    const stateObject = new Mapper(new Mapper(this.useWindow === "true" ? window : this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <input type="text" id="--${this.id !== "null" ? this.id : this.label}" value="${stateObject.read(this.mapKey ?? "", "")}" style="
        height        : 56px;     
        background    : #E4E4E44D;
        border-radius : 4px;      
        border        : none;     
        width         : 100%;
      "
      @keyup="${_ => this.onUserInput(this.label, _.target.value, this.mapKey, this.statePath, true, this.id)}"
      >
    </div>
    `;
  }
}
customElements.define("edit-field", EditField);

export class SelectField extends BElement {
  constructor() {
    super();

    this.label = this.getAttribute('label');
    this.ratio = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  view() {
    this.items = JSON.parse(this.getAttribute('items')) ?? [];
    const stateObject = new Mapper(new Mapper(this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <select style="
        height        : 56px;
        background    : #E4E4E44D;
        border-radius : 4px;
        border        : none;
        width         : 100%;
        font-family   : Quicksand;
        font-style    : normal;
        font-weight   : 500;
        font-size     : 18px;
        line-height   : 22px;
      "
      @change="${_ => updatePrescription(this.label, _.target.value, this.mapKey, this.statePath)}"
      >
      ${this.items.map(_ => {
      //console.info(this.mapKey, _.value === stateObject.read(this.mapKey))
      return new Option(_.label, _.value, false, _.value === stateObject.read(this.mapKey))
    })}
      </select>
    </div>
    `;
  }
}
customElements.define("select-field", SelectField);

export class ClinicEditPopup extends BElement {

  cancelPopupEditClinic() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--clinic-betriebsstätten").value = psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value");
    cancelPopupEditClinic();
  }

  view() {
    return html`
      <div class="modal" id="clinicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Betriebsstätten-Nr.</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow">
            <select-field statePath="prescriptions.clinicPopup" mapKey="type" label="Type" items="${JSON.stringify(FIELD_CLINIC_TYPE)}"></select-field> 
            <edit-field statePath="prescriptions.clinicPopup" mapKey="value" id="clinic-betriebsstätten" label="Betriebsstätten-Nr" />
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditClinic()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditClinic()}" class="ok-next" id="clinic-save-button">Speichern</button>
        </div>
        <div id="clinicEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("clinic-edit-popup", ClinicEditPopup);

export class PractIdEditPopup extends BElement {

  cancelPopupEditPractId() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--practId-doctor-number").value = psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value");
    cancelPopupEditPractId();
  }

  view() {
    return html`
      <div class="modal" id="PractIdEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Arzt-Nr.</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow">
            <select-field statePath="prescriptions.PractIdPopup" mapKey="type" label="Type" items="${JSON.stringify(FIELD_PRACTID_TYPE)}"></select-field> 
            <edit-field statePath="prescriptions.PractIdPopup" mapKey="value" id="practId-doctor-number" label="Betriebsstätten-Nr" />
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditPractId()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditPractId()}" class="ok-next" id="practId-save-button">Speichern</button>
        </div>
        <div id="PractIdEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("pract-id-edit-popup", PractIdEditPopup);

export class MedicamentEditPopup extends BElement {

  view() {
    return html`
      <div class="modal" id="medicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Medikament</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="medicationText" label="Handelsname" id="medic-medicationText"</edit-field>
          </div>
          <div class="fieldRow">
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="pzn" label="PZN" ratio="0.5" id="medic-pzn"></edit-field>
          </div>
          <div class="fieldRow">
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="quantityValue" label="Menge" id="medic-quantity"></edit-field>
            <select-field statePath="prescriptions.MedikamentPopup" mapKey="norm" label="Normgröße" items="${JSON.stringify(FIELD_NORMGROBE_TYPE)}"></select-field> 
            <select-field statePath="prescriptions.MedikamentPopup" mapKey="form" label="Darreichungsform" items="${JSON.stringify(FIELD_DARREICH_TYPE)}"></select-field> 
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medic-dosage-instructions"</edit-field>
          </div>
        </div>
        <div class="modal-buttons">
        <button data-close-button class="cancel" @click="${() => cancelPopupEditMedikament()}">Abbrechen</button>
        <button data-modal-target-processing="#processing" @click="${() => savePopupEditMedikament()}" class="ok-next" id="medic-save-button">Speichern</button>
    </div>
    <div id="medicEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("medicament-edit-popup", MedicamentEditPopup);

export class PatientEditPopup extends BElement {
  cancelPopupEditPatient() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--patient-prefix").value            = psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]", "");
    document.getElementById("--patient-given").value             = psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]");
    document.getElementById("--patient-family").value            = psp.read("entry[resource.resourceType?Patient].resource.name[0].family");
    document.getElementById("--patient-street-name").value       = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString");
    document.getElementById("--patient-street-number").value     = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString");
    document.getElementById("--patient-street-additional").value = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", "");
    document.getElementById("--patient-postal-code").value       = psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode");
    document.getElementById("--patient-city").value              = psp.read("entry[resource.resourceType?Patient].resource.address[0].city");

    cancelPopupEditPatient();
  }
  view() {
    return html`
      <div class="modal" id="patientEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Name und Adresse des Patienten</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-prefix" label="Titel" mapKey="patientPrefix"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-given" label="Vorname"  mapKey="patientGiven"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-family" label="Nachname" mapKey="patientFamily"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-name" label="Straße" mapKey="patientStreetName" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-number" label="Hausnummer" mapKey="patientStreetNumber" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-additional" label="Adresszusatz" mapKey="patientStreetAdditional" ></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-postal-code" label="Postleitzahl" mapKey="patientPostalCode" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-city" label="Stadt" mapKey="patientCity" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditPatient()}">Abbrechen</button>
            <button data-close-button class="check-errors" @click="${() => ValidateAllFieldsInCurrentPopup()}">Fehler prüfen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditPatient()}" class="ok-next" id="patient-save-button">Speichern</button>
        </div>
        <div id="patientEdit-error-messages"/>
      </div>
    `;
  }
};
customElements.define("patient-edit-popup", PatientEditPopup);


export class OrganizationEditPopup extends BElement {

  cancelPopupEditOrga() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);

    document.getElementById("--practitioner-prefix").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]", "");
    document.getElementById("--practitioner-given").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]");
    document.getElementById("--practitioner-family").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family");
    //document.getElementById("--qualifikation").value = psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code");
    document.getElementById("--practitioner-qualification-text").value = psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text", "");
    document.getElementById("--organization-name").value = psp.read("entry[resource.resourceType?Organization].resource.name");
    document.getElementById("--organization-street-name").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString");
    document.getElementById("--organization-street-number").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString");
    document.getElementById("--organization-street-additional").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", "");
    document.getElementById("--organization-postal-code").value = psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode");
    document.getElementById("--organization-city").value = psp.read("entry[resource.resourceType?Organization].resource.address[0].city");
    document.getElementById("--organization-phone").value = psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value");

    cancelPopupEditOrga();
  }

  view() {
    return html`
      <div class="modal" id="organizationEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left;margin-bottom:15px">
          <p style="text-align:left"><strong>Verschreibender Arzt</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-prefix" mapKey="practitionerPrefix" label="Titel"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-given" mapKey="practitionerGiven" label="Vorname"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-family" mapKey="practitionerFamily" label="Nachname"></edit-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.OrgaPopup" mapKey="qualifikation" label="Qualifikation" ratio="1" items="${JSON.stringify(FIELD_PRACTQUALI_CODE)}"></select-field> 
            <edit-field statePath="prescriptions.OrgaPopup" id='practitioner-qualification-text' mapKey="berufsbezeichnung" label="Berufsbezeichnung" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-title" style="text-align:left;margin-top:15px;margin-bottom:15px">
          <p style="text-align:left"><strong>Informationen zum Betrieb</strong></p>
        </div>
        <div style="text-align:left">
        <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-name" mapKey="organizationName" label="Betriebsname" ratio="1"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-name" mapKey="organizationStreetName" label="Straße" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-number" mapKey="organizationStreetNumber" label="Hausnummer" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-additional" mapKey="organizationStreetAdditional" label="Adresszusatz"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-postal-code" mapKey="organizationPostalCode" label="Postleitzahl" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-city" mapKey="organizationCity" label="Stadt" ratio="2"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-phone" mapKey="organizationPhone" label="Telefonnummer" ratio="1"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditOrga()}">Abbrechen</button>
            <button data-close-button class="check-errors" @click="${() => ValidateAllFieldsInCurrentPopup()}">Fehler prüfen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditOrga()}" class="ok-next" id="organization-save-button">Speichern</button>
        </div>
        <div id="organizationEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("organization-edit-popup", OrganizationEditPopup);

export class StatusEditPopup extends BElement {
  view() {
    return html`
      <div class="modal" id="statusEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Status</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?versichertenart].valueCoding.code" label="Versichertenart" items="${JSON.stringify(FIELD_STATUS_VERSICHERTENART)}"></select-field>
          </div>
          <div class="fieldRow">
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?personengruppe].valueCoding.code" label="Besondere Personengruppe (optional)" items="${JSON.stringify(FIELD_STATUS_BESONDERE)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?dmp].valueCoding.code" label="DMP-Zuordnung (optional)" items="${JSON.stringify(FIELD_STATUS_ZUORDNUNG)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Composition].resource.extension[url?KBV_EX_FOR_Legal_basis].valueCoding.code" label="Statuskennzeichen (optional)" items="${JSON.stringify(FIELD_STATUS_STATUSKENNZEICHEN)}"></select-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => _hidePopup()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => _hidePopup()}" class="ok-next">Speichern</button>
        </div>
      </div>
    `;
  }
}
customElements.define("status-edit-popup", StatusEditPopup);