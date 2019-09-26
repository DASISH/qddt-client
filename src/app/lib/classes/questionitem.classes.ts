import {IEntityAudit, IEntityEditAudit, IVersion} from '../interfaces';
import {ElementKind} from '../enums';
import {ResponseDomain} from './responsedomain.classes';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  agency: IEntityAudit;
  name: string;
  modified: number;
  version: IVersion;
  classKind = ElementKind[ElementKind.QUESTION_ITEM];
  basedOnObject: string;
  basedOnRevision: number;
  question: string;
  intent: string;
  responseDomain: ResponseDomain;
  responseDomainName: String;
  responseDomainRevision: number;
  conceptRefs: any;
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);
  }
}