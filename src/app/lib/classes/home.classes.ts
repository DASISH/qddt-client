import { IEntityEditAudit, IVersion, IOtherMaterial, IComment, HalLink, IRevId, IParentRef } from '../interfaces';
import { ElementKind } from '../enums';
import { Instrument } from './instrument.classes';
import { ElementRevisionRef } from './element-revision-ref';
import { Agency, User } from './user.classes';


export class SurveyProgram implements IEntityEditAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  authors?: any[];
  archived = false;
  // children: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  changeKind?: string;
  basedOn?:IRevId
  parentIdx?: number;
  parentRef?: IParentRef;
  changeComment?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
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
  label: string;
  name: string;
  description: string;
  archived = false;
  authors?: any[];
  children?: Topic[];
  instruments?: Instrument[]
  classKind = ElementKind[ElementKind.STUDY];
  changeKind?: string;
  basedOn?:IRevId
  parentIdx?: number;
  parentRef?: IParentRef;
  changeComment?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
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
  label: string;
  description: string;
  archived = false;
  authors?: any[];
  topicQuestionItems: ElementRevisionRef[];
  // children: Concept[];
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  changeKind?: string;
  basedOn?:IRevId
  parentIdx?: number;
  parentRef?: IParentRef;
  changeComment?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  agency?: Agency;
  otherMaterials?: IOtherMaterial[];
  xmlLang?: string;
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
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
  // children: Concept[];
  classKind = ElementKind[ElementKind.CONCEPT];
  agency: Agency;
  basedOn?:IRevId
  parentIdx?: number;
  parentRef?: IParentRef;

  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  xmlLang?: string;
  comments?: IComment[];

  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<Concept>) {
    Object.assign(this, init);
  }
  setLanguage(lang: string): Concept {
    this.xmlLang = lang;
    return this;
  }

}
