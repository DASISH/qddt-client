import { ElementRevisionRef, ElementRevisionRefImpl } from './element-revision-ref';
import { IEntityEditAudit, IVersion, IParentRef } from '../interfaces';
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
  basedOnObject: string;
  basedOnRevision: number;
  changeComment?: string;
  changeKind?: string;
  question = '';
  intent: string;
  xmlLang = 'none';
  responseDomainRef: ElementRevisionRefImpl<ResponseDomain>;
  parentRefs: IParentRef[];
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);
    if (!this.responseDomainRef) {
      this.responseDomainRef = new ElementRevisionRefImpl<ResponseDomain>({ elementKind: 'RESPONSE_DOMAIN' });
    }
  }
}
