import {ElementKind} from '../enums';
import {IComment, IEntityAudit} from '../interfaces';
import { ElementRevisionRef } from './element-revision-ref';



export class Publication  implements  IEntityAudit {
  id: string;
  name: string;
  purpose: string;
  status: PublicationStatus;  // = { id: 0, published: 'NOT_PUBLISHED', label: 'No publication' };  // magic number NOT_PUBLISHED
  classKind = ElementKind[ElementKind.PUBLICATION];
  xmlLang?: string;
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
