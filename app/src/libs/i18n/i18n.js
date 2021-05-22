import {de} from "./res/de.js";
import {en} from "./res/en.js";

const res  = { de, en };
let locale = "de";

export const setLocale = (locale) => void(locale = locale);
export const i18n      = (key, def) => res[locale]?.[key] ?? def ?? key;