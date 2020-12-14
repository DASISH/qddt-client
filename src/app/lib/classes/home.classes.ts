import { IParentRef, IEntityEditAudit, IUser, IVersion, IOtherMaterial, IComment } from '../interfaces';
import { ElementKind } from '../enums';
import { Instrument } from './instrument.classes';
import { ElementRevisionRef } from './element-revision-ref';
import { Agency } from './user.classes';


export class SurveyProgram implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  authors?: any[];
  archived = false;
  studies: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  changeKind?: string;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  public constructor(init?: Partial<SurveyProgram>) {
    Object.assign(this, init);
  }
  setLanguage(lang: string): SurveyProgram {
    this.xmlLang = lang;
    return this;
  }
}

export class Study implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  archived = false;
  authors?: any[];
  topicGroups?: Topic[];
  instruments?: Instrument[]
  classKind = ElementKind[ElementKind.STUDY];
  changeKind?: string;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  public constructor(init?: Partial<Study>) {
    Object.assign(this, init);
  }
  setLanguage(lang: string): Study {
    this.xmlLang = lang;
    return this;
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
  changeKind?: string;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  parentRef?: IParentRef;
  public constructor(init?: Partial<Topic>) {
    Object.assign(this, init);
  }
  setLanguage(lang: string): Topic {
    this.xmlLang = lang;
    return this;
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
  agency: Agency;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  xmlLang?: string;
  comments?: IComment[];
  parentRef?: IParentRef;
  public constructor(init?: Partial<Concept>) {
    Object.assign(this, init);
  }
  setLanguage(lang: string): Concept {
    this.xmlLang = lang;
    return this;
  }

}
