import { ElementRevisionRef } from './element-revision-ref';
import { IEntityAudit, IEntityEditAudit, IVersion } from '../interfaces';
import { ElementKind } from '../enums';

export class QuestionItem implements IEntityEditAudit {
  id: string;
  agency: IEntityAudit;
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
  xmlLang = 'en-GB';
  responsedomainRef: ElementRevisionRef;
  conceptRefs: any;
  public constructor(init?: Partial<QuestionItem>) {
    Object.assign(this, init);
  }
}
