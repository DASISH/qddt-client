import { IEntityEditAudit, IVersion, IOtherMaterial, IComment, HalLink, IRevId, IParentRef } from '../interfaces';
import { ElementKind } from '../enums';
import { Instrument } from './instrument.classes';
import { ElementRevisionRef, ElementRevisionRefImpl } from './element-revision-ref';
import { Agency, User } from './user.classes';

export class SurveyProgram implements IEntityEditAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  xmlLang?: string;

  otherMaterials?: IOtherMaterial[];
  authors?: any[];

  modified?: number;
  version?: IVersion = { major: 1, minor: 0 };
  changeKind?: string;
  changeComment?: string;
  basedOn?: IRevId
  parentId?: string;
  parentIdx?: number;
  parentRef?: IParentRef;
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  isArchived = false;
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
  xmlLang?: string;

  otherMaterials?: IOtherMaterial[];
  authors?: any[];
  instruments?: Instrument[]

  modified?: number;
  version?: IVersion = { major: 1, minor: 0 };
  changeKind?: string;
  changeComment?: string;
  basedOn?: IRevId
  parentId?: string;
  parentIdx?: number;
  parentRef?: IParentRef;
  classKind = ElementKind[ElementKind.STUDY];
  isArchived = false;

  modifiedBy?: User | string;
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
  label: string;
  name: string;
  description: string;
  xmlLang?: string;

  questionItems: ElementRevisionRef[];
  otherMaterials?: IOtherMaterial[];
  authors?: any[];

  modified?: number;
  version?: IVersion = { major: 1, minor: 0 };
  changeKind?: string;
  changeComment?: string;
  basedOn?: IRevId
  parentId?: string;
  parentIdx?: number;
  parentRef?: IParentRef;
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  isArchived = false;

  modifiedBy?: User | string;
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<Topic>) {
    Object.assign(this, init);
    if (!init._embedded) {
      this._embedded = {}
      this._embedded.modifiedBy = init.modifiedBy
    }
    // if (init._embedded?.children) {
    //   this.children = init._embedded.children
    //   this._embedded.children = null
    // }
    if (this.questionItems) {
      this.questionItems.forEach(item => new ElementRevisionRefImpl(item))
    }
  }
  setLanguage(lang: string): Topic {
    this.xmlLang = lang;
    return this;
  }

}

export class Concept implements IEntityEditAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  xmlLang?: string;

  questionItems: ElementRevisionRef[];
  otherMaterials?: IOtherMaterial[];
  authors?: any[];
  children?: Concept[]

  modified?: number;
  version?: IVersion = { major: 1, minor: 0 };
  changeKind?: string;
  changeComment?: string;
  basedOn?: IRevId
  parentId?: string;
  parentIdx?: number;
  parentRef?: IParentRef;
  classKind = ElementKind[ElementKind.CONCEPT];
  isArchived = false;

  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<Concept>) {
    // if (init._embedded?.children) {
    //   init.children = init._embedded.children
    //   init._embedded = { agency : init._embedded.agency, modifiedBy : init._embedded.modifiedBy}
    // }
    Object.assign(this, init);
  }
  setLanguage(lang: string): Concept {
    this.xmlLang = lang;
    return this;
  }

  // public get subConcepts(){ return this.children || this._embedded?.children || []}

}


export class ConceptPojo  {
  id: string;
  name: string;
  label: string;
  description: string;
  isArchived = false;
  classKind = ElementKind[ElementKind.CONCEPT];
  basedOn: IRevId
  changeComment: string;
  changeKind: string;
  modified: number;
  version: IVersion = { major: 1, minor: 0 };
  xmlLang: string;
  parentIdx: number;

  public constructor(init?: Partial<Concept>) {
    for(const key in init){
      if(this.hasOwnProperty(key)){
        this[key] = init[key];
      }
    }
  }
}
