import { QueryInfo } from '../classes';
import { ElementKind } from '../enums';
import { QDDT_QUERY_INFOS } from './query-info.config';

export const PUBLICATION_TYPES: QueryInfo[] = [
  QDDT_QUERY_INFOS[ElementKind.TOPIC_GROUP],
  QDDT_QUERY_INFOS[ElementKind.CONCEPT],
  QDDT_QUERY_INFOS[ElementKind.QUESTION_ITEM],
  QDDT_QUERY_INFOS[ElementKind.QUESTION_CONSTRUCT],
  QDDT_QUERY_INFOS[ElementKind.SEQUENCE_CONSTRUCT],
  QDDT_QUERY_INFOS[ElementKind.INSTRUMENT],
];

