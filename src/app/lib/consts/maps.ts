import { ConstructKind, LanguageKind} from '../enums';
import { toSelectItems } from './functions';

export const LANGUAGE_MAP = toSelectItems(LanguageKind);

export const CONSTRUCT_MAP = toSelectItems(ConstructKind);

