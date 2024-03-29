import { ElementKind } from '../enums';
import { IComment, ISelectOption, IEntityEditAudit, HalLink } from '../interfaces';
import { ElementRevisionRef, ElementRevisionRefImpl } from './element-revision-ref';
import { Agency } from './user.classes';

export class Publication implements IEntityEditAudit {
  id: string;
  name: string;
  purpose: string;
  statusId: number;
  status: PublicationStatus;  // = { id: 0, published: 'NOT_PUBLISHED', label: 'No publication' };  // magic number NOT_PUBLISHED
  classKind = ElementKind[ElementKind.PUBLICATION];
  xmlLang?: string;
  publicationElements: ElementRevisionRef[] = [];
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<Publication>) {
    Object.assign(this, init);
    this.publicationElements.forEach((item, idx, array) => {
      array[idx] = new ElementRevisionRefImpl(item)
    })
  }
}

export class PublicationStatus implements ISelectOption {
  id: number;
  label: string;
  value: any;
  published: string;
  description?: string;
  children?: PublicationStatus[];

  public constructor(init?: Partial<PublicationStatus>) {
    Object.assign(this, init);
    this.value = this.id;
  }
}
