import { IEntityEditAudit, IVersion, IParentRef, HalLink, IRevId } from '../interfaces';
import { ElementKind } from '../enums';
import { Agency } from './user.classes';
import { ResponseDomain } from './responsedomain.classes';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  name = '';
  question = '';
  intent: string;
  modified: number;
  xmlLang?: string;
  version: IVersion = { major: 1, minor: 0 };
  classKind = ElementKind[ElementKind.QUESTION_ITEM];
  changeKind?: string;
  changeComment?: string;
  basedOn?: IRevId;
  responseId: IRevId;
  responseName: string;
  // responseDomain: ResponseDomain;
  parentRefs: IParentRef[];

  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);
    if (!this._embedded) {
      this._embedded = {}
    }
  }

  get response(): ResponseDomain {
    return this._embedded?.responseDomain
  }
  set response(responseDomain: ResponseDomain) {
    if (!this._embedded) {
      this._embedded = {}
    }
    this._embedded.responseDomain = responseDomain
  }
}
