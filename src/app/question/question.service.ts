import { IEntityEditAudit, IEntityAudit, IVersion } from '../shared/elementinterfaces/entityaudit';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { ElementKind } from '../shared/elementinterfaces/elements';



export class QuestionItem implements IEntityEditAudit {

  id: string;
  agency: IEntityAudit;
  name: string;
  modified: number;
  version: IVersion;
  classKind: string;
  basedOnObject: string;
  basedOnRevision: number;
  question: string;
  intent: string;
  responseDomain: ResponseDomain;
  responseDomainName: String;
  responseDomainRevision: number;
  conceptRefs: any;

  constructor() {
    this.classKind = ElementKind[ElementKind.QUESTION_ITEM];
  }
}

