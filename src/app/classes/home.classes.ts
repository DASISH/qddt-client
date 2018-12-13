import {ElementKind} from './enums';
import {ElementRevisionRef} from './classes';
import {IComment, IEntityAudit, IEntityEditAudit, IUser, IVersion} from './interfaces';

export interface IRef {
  id: string;
  name: string;
  parent?: IRef;
}


export class SurveyProgram implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  authors?: any[];
  archived = false;

  studies: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
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

  topicGroups: Topic[];
  classKind = ElementKind[ElementKind.STUDY];
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

  topicQuestionItems: ElementRevisionRef[];
  concepts: Concept[];
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  studyRef?: IRef;
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

  conceptQuestionItems: ElementRevisionRef[];
  children: Concept[];
  classKind = ElementKind[ElementKind.CONCEPT];
  topicRef?: IRef;
  public constructor(init?: Partial<Concept>) {
    Object.assign(this, init);
  }
}
