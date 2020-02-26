import {QueryInfo} from '../classes';
import {ElementKind} from '../enums';
import {QDDT_QUERY_INFOES} from './query-info.config';

export const SEQUENCE_TYPES: QueryInfo[] = [
  QDDT_QUERY_INFOES[ElementKind.QUESTION_CONSTRUCT],
  QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT],
  QDDT_QUERY_INFOES[ElementKind.STATEMENT_CONSTRUCT],
  QDDT_QUERY_INFOES[ElementKind.CONDITION_CONSTRUCT],
];
