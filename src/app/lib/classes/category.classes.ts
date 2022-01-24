import { registerLocaleData } from '@angular/common';
import { ElementKind } from '../enums';
import { IComment, IEntityEditAudit, IVersion, IUser, IOtherMaterial, IRevId } from '../interfaces';
import { Agency, User } from './user.classes';


export enum CategoryKind {
  DATETIME,
  TEXT,
  NUMERIC,
  BOOLEAN,
  URI,
  CATEGORY,
  MISSING_GROUP,
  LIST,
  SCALE,
  MIXED
}

export enum HierarchyLevel { ENTITY, GROUP_ENTITY }

export interface ICategoryInfo {
  kind: CategoryKind;
  level: HierarchyLevel;
  description: string;
}

export const CATEGORY_INFO: ICategoryInfo[] = [
  { kind: CategoryKind.DATETIME, level: HierarchyLevel.ENTITY, description: 'Datetime' },
  { kind: CategoryKind.TEXT, level: HierarchyLevel.ENTITY, description: 'Text' },
  { kind: CategoryKind.NUMERIC, level: HierarchyLevel.ENTITY, description: 'Numeric' },
  { kind: CategoryKind.BOOLEAN, level: HierarchyLevel.ENTITY, description: 'Boolean' },
  { kind: CategoryKind.URI, level: HierarchyLevel.ENTITY, description: 'Uniform Resource Identifier' },
  { kind: CategoryKind.CATEGORY, level: HierarchyLevel.ENTITY, description: 'Code' },
  { kind: CategoryKind.MISSING_GROUP, level: HierarchyLevel.GROUP_ENTITY, description: 'CodeList Missing value' },
  { kind: CategoryKind.LIST, level: HierarchyLevel.GROUP_ENTITY, description: 'CodeList' },
  { kind: CategoryKind.SCALE, level: HierarchyLevel.GROUP_ENTITY, description: 'ScaleDomain' },
  { kind: CategoryKind.MIXED, level: HierarchyLevel.GROUP_ENTITY, description: 'Mixed Mananged representation' },
];

export class ResponseCardinality {
  minimum: number;
  maximum: number;
  stepUnit: number;
  public constructor(init?: Partial<ResponseCardinality>) {
    this.minimum = this.maximum = this.stepUnit = 1;
    Object.assign(this, init);
  }
}

export class Code {
  value: string;
  public constructor(init?: Partial<Code>) {
    Object.assign(this, init);
  }

  public getValue?(): number { return parseInt(this.value) || 0; }

}

export class Category implements IEntityEditAudit {
  id: string;
  name = '';
  label = '';
  description = '';
  hierarchyLevel = HierarchyLevel[CATEGORY_INFO[CategoryKind.CATEGORY].level];
  categoryKind = CategoryKind[CategoryKind.CATEGORY];
  classKind = ElementKind[ElementKind.CATEGORY];
  inputLimit = new ResponseCardinality();
  code?: Code;
  format?: any;
  changeKind?: string;
  basedOn?: IRevId;

  changeComment?: string;
  modified: number =0;
  modifiedBy?: User|string;
  version?: IVersion;
  agency?: Agency;
  isArchived?: boolean;
  otherMaterials?: IOtherMaterial[];
  xmlLang: string; // = 'en-GB';
  comments?: IComment[];
  get children(): Category[] {
    return this._embedded.children;
  }
  set children(value: Category[]) {
    this._embedded.children = value;
  }

  _embedded?: {
    [rel: string]: any;
  } = {}
  public constructor(init?: Partial<Category>) {
    Object.assign(this, init);
    if (this.name && !this.label) {
      this.label = this.name;
    } else if (this.label && !this.name) {
      this.name = this.label.toLocaleUpperCase();
    }
    this.code = (init) ? new Code(init.code) : new Code();
    this.children = ((init) && (init.children)) ? init.children.map(value => new Category(value)) : [];
  }

  public setKind(kind: CategoryKind): Category {
    this.hierarchyLevel = HierarchyLevel[CATEGORY_INFO[kind].level];
    this.categoryKind = CategoryKind[kind];
    if (kind.valueOf() <= CategoryKind.CATEGORY) {
      this.code = new Code({ value: '1' });
    } else if (kind.valueOf() <= CategoryKind.MISSING_GROUP) {
      this.inputLimit.minimum = 0;
    }

    return this;
  }

  setEmbedded() : Category{
    if (this._embedded.m)
    return this;
  }


}
