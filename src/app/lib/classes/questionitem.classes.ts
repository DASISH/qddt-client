import { IEntityEditAudit, IVersion, IParentRef, HalLink, IRevId } from '../interfaces';
import { ElementKind } from '../enums';
import { Agency } from './user.classes';
import { ResponseDomain } from './responsedomain.classes';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  agency: Agency;
  name = '';
  modified: number;
  version: IVersion = { major: 1, minor: 0 };
  classKind = ElementKind[ElementKind.QUESTION_ITEM];
  basedOn?: IRevId;
  changeComment?: string;
  changeKind?: string;
  question = '';
  intent: string;
  xmlLang?: string;
  responseId: IRevId;
  // responseDomain: ResponseDomain;
  parentRefs: IParentRef[];

  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  responseName: string;
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);

  }

  get response(): ResponseDomain {
    return  this._embedded?.responseDomain
  }
  set response(responseDomain: ResponseDomain) {
    if (!this._embedded) {
      this._embedded = {}
    }
    this._embedded.responseDomain = responseDomain
  }
}
