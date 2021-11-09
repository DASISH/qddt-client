import {QueryInfo} from '../classes';
import {ElementKind} from '../enums';
import {QDDT_QUERY_INFOS} from './query-info.config';

export const SEQUENCE_TYPES: QueryInfo[] = [
  QDDT_QUERY_INFOS[ElementKind.QUESTION_CONSTRUCT],
  QDDT_QUERY_INFOS[ElementKind.SEQUENCE_CONSTRUCT],
  QDDT_QUERY_INFOS[ElementKind.STATEMENT_CONSTRUCT],
  QDDT_QUERY_INFOS[ElementKind.CONDITION_CONSTRUCT],
];
