import {QueryInfo} from '../classes';
import {ElementKind} from '../enums';
import {QDDT_QUERY_INFOES} from './query-info.config';

export const PUBLICATION_TYPES: QueryInfo[] = [
  QDDT_QUERY_INFOES[ElementKind.TOPIC_GROUP],
  QDDT_QUERY_INFOES[ElementKind.CONCEPT],
  QDDT_QUERY_INFOES[ElementKind.QUESTION_ITEM],
  QDDT_QUERY_INFOES[ElementKind.QUESTION_CONSTRUCT],
  QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT],
];
