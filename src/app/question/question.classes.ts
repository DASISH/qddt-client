import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { IEntityAudit, IEntityEditAudit, IVersion } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';



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

