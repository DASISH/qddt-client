
import { StringIsNumber, enumKeys } from './functions';
import { EnumItem, toEnumItems } from '../enums';
import { LanguageKind } from '../enums/language-kind';


export const enumLANGUAGES = toEnumItems( LanguageKind );

export const langMap = enumKeys(LanguageKind);

