import { ISelectOption } from './../interfaces/interfaces';
export enum LanguageKind {
  'none',
  'ar-EG',
  'en-GB',
  'en-CA',
  'en-US',
  'fr-CA',
  'fr-FR',
  'nb-NO',
  'nn-NO'
}

export const selectLanguages: ISelectOption[] = [
  { id: 0, label: 'none', value: 'none' },
  { id: 1, label: '🇪🇬  ar-EG', value: 'ar-EG' },
  { id: 2, label: '🇬🇧  en-GB', value: 'en-GB' },
  { id: 3, label: '🇬🇧  en-CA', value: 'en-CA' },
  { id: 4, label: '🇺🇸  en-US', value: 'en-US' },
  { id: 5, label: '🇫🇷  fr-CA', value: 'fr-CA' },
  { id: 6, label: '🇫🇷  fr-FR', value: 'fr-FR' },
  { id: 7, label: '🇳🇴  nb-NO', value: 'nb-NO' },
  { id: 8, label: '🇳🇴  nn-NO', value: 'nn-NO' }
]
