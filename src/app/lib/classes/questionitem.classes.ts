import { IEntityEditAudit, IVersion, IParentRef, HalLink, IRevId } from '../interfaces';
import { ElementKind } from '../enums';
import { ResponseDomain } from './responsedomain.classes';
import { Agency } from './user.classes';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  agency: Agency;
  name = '';
  modified: number;
  version: IVersion = { major: 0, minor: 0 };
  classKind = ElementKind[ElementKind.QUESTION_ITEM];
  basedOn?: IRevId;
  changeComment?: string;
  changeKind?: string;
  question = '';
  intent: string;
  xmlLang = 'none';
  responseId: IRevId;
  responseDomain: ResponseDomain;
  parentRefs: IParentRef[];

  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);

  }
}
