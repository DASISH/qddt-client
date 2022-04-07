import { ConstructKind, selectLanguages } from '../enums';
import { toSelectItems } from './functions';

export const LANGUAGE_MAP = selectLanguages; // toSelectItems(LanguageKind);


export const CONSTRUCT_MAP = toSelectItems(ConstructKind);

