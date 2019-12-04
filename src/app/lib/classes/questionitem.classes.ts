import {IEntityAudit, IEntityEditAudit, IVersion} from '../interfaces';
import {ElementKind} from '../enums';
import {ResponseDomain} from './responsedomain.classes';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  agency: IEntityAudit;
  name: string;
  modified: number;
  version: IVersion = {major: 0, minor: 0 };
  classKind = ElementKind[ElementKind.QUESTION_ITEM];
  basedOnObject: string;
  basedOnRevision: number;
  question: string;
  intent: string;
  xmlLang?: string;
  responseDomain: ResponseDomain;
  responseDomainName: string;
  responseDomainRevision: number;
  conceptRefs: any;
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);
  }
}
