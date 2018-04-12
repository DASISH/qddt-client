import { IEntityAudit, IEntityEditAudit, IVersion} from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { ElementRevisionRef } from '../shared/classes/classes';

export class SurveyProgram implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  authors?: any[];
  comments?: any[];
  modified: any;
  archived: boolean;
  studies: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  version: IVersion;
}

export class Study implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  authors?: any[];
  comments?: any[];
  topicGroups: Topic[];
  classKind = ElementKind[ElementKind.STUDY];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  modified: number;
  version: IVersion;
}

export class Topic implements IEntityEditAudit {
  id: string;
  name: string;
  abstractDescription: string;
  archived: boolean;
  authors?: any[];
  comments?: any[];
  otherMaterials: any[];
  topicQuestionItems: ElementRevisionRef[];
  concepts: Concept[];
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  modified: number;
  version: IVersion;

}

export class Concept implements IEntityEditAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  authors: any[];
  conceptQuestionItems: ElementRevisionRef[];
  children: Concept[];
  comments: any[];
  classKind = ElementKind[ElementKind.CONCEPT];
  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;
}
