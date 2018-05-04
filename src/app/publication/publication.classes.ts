import {QDDT_QUERY_INFOES} from '../shared/classes/constants';
import {IComment, IEntityAudit} from '../shared/classes/interfaces';
import {ElementRevisionRef, QueryInfo} from '../shared/classes/classes';
import {ElementKind} from '../shared/classes/enums';

export const PUBLICATION_TYPES: QueryInfo[] = [
  QDDT_QUERY_INFOES[ElementKind.TOPIC_GROUP],
  QDDT_QUERY_INFOES[ElementKind.CONCEPT],
  QDDT_QUERY_INFOES[ElementKind.QUESTION_ITEM],
  QDDT_QUERY_INFOES[ElementKind.QUESTION_CONSTRUCT],
  QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT],
];


export class Publication  implements  IEntityAudit {
  id: string;
  name: string;
  purpose: string;
  status: PublicationStatus;  // = { id: 0, published: 'NOT_PUBLISHED', label: 'No publication' };  // magic number NOT_PUBLISHED
  classKind = ElementKind[ElementKind.PUBLICATION];
  publicationElements: ElementRevisionRef[] = [];
  comments?: IComment[];
  public constructor(init?: Partial<Publication>) {
    Object.assign(this, init);
  }

}

export class PublicationStatus {
  id: number;
  label: string;
  published: string;
  description?: string;
  children?: PublicationStatus[];

  public constructor(init?: Partial<PublicationStatus>) {
    Object.assign(this, init);
  }
}
