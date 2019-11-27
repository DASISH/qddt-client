import {IEntityAudit, IEntityEditAudit, ITreeRef, IUser, IVersion} from '../interfaces';
import {ElementKind} from '../enums';
import {Instrument} from './instrument.classes';
import {ElementRevisionRef} from './element-revision-ref';


export class SurveyProgram implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  authors?: any[];
  comments?: any[];
  modified: any;
  archived = false;
  studies: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  version: IVersion;
  public constructor(init?: Partial<SurveyProgram>) {
    Object.assign(this, init);
  }
}

export class Study implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  archived = false;
  authors?: any[];
  comments?: any[];
  topicGroups?: Topic[];
  instruments?: Instrument[]
  classKind = ElementKind[ElementKind.STUDY];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  modified: number;
  version: IVersion;
  public constructor(init?: Partial<Study>) {
    Object.assign(this, init);
  }
}

export class Topic implements IEntityEditAudit {
  id: string;
  name: string;

  description: string;
  archived = false;
  authors?: any[];
  comments?: any[];
  otherMaterials: any[];
  topicQuestionItems: ElementRevisionRef[];
  concepts: Concept[];
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified: number;
  modifiedBy?: IUser;
  version: IVersion;
  studyRef?: ITreeRef;
  public constructor(init?: Partial<Topic>) {
    Object.assign(this, init);
  }
}

export class Concept implements IEntityEditAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  archived = false;
  authors: any[];
  comments: any[];

  conceptQuestionItems: ElementRevisionRef[];
  children: Concept[];
  classKind = ElementKind[ElementKind.CONCEPT];
  agency: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  topicRef?: ITreeRef;
  public constructor(init?: Partial<Concept>) {
    Object.assign(this, init);
  }
}
