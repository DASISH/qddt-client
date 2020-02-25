import { ElementKind } from '../enums';
import {IComment, ISelectOption, IEntityEditAudit, IEntityAudit} from '../interfaces';
import {ElementRevisionRef } from './element-revision-ref';

export class Publication implements IEntityEditAudit {
  id: string;
  name: string;
  purpose: string;
  statusId: number;
  status: PublicationStatus;  // = { id: 0, published: 'NOT_PUBLISHED', label: 'No publication' };  // magic number NOT_PUBLISHED
  classKind = ElementKind[ElementKind.PUBLICATION];
  xmlLang?: string;
  agency?: IEntityAudit;
  publicationElements: ElementRevisionRef[] = [];
  comments?: IComment[];
  public constructor(init?: Partial<Publication>) {
    Object.assign(this, init);
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
