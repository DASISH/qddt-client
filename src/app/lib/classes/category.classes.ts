import {IComment, IEntityEditAudit, IVersion} from '../interfaces';
import {ElementKind} from '../enums';


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
  {kind: CategoryKind.DATETIME, level: HierarchyLevel.ENTITY , description: 'Datetime'},
  {kind: CategoryKind.TEXT, level: HierarchyLevel.ENTITY , description: 'Text'},
  {kind: CategoryKind.NUMERIC, level: HierarchyLevel.ENTITY , description: 'Numeric'},
  {kind: CategoryKind.BOOLEAN, level: HierarchyLevel.ENTITY , description: 'Boolean'},
  {kind: CategoryKind.URI, level: HierarchyLevel.ENTITY , description: 'Uniform Resource Identifier'},
  {kind: CategoryKind.CATEGORY, level: HierarchyLevel.ENTITY , description: 'Code'},
  {kind: CategoryKind.MISSING_GROUP, level: HierarchyLevel.GROUP_ENTITY , description: 'CodeList Missing value'},
  {kind: CategoryKind.LIST, level: HierarchyLevel.GROUP_ENTITY , description: 'CodeList'},
  {kind: CategoryKind.SCALE, level: HierarchyLevel.GROUP_ENTITY , description: 'ScaleDomain'},
  {kind: CategoryKind.MIXED, level: HierarchyLevel.GROUP_ENTITY , description: 'Mixed Mananged representation'},
];

export class ResponseCardinality {
  minimum: number;
  maximum: number;
  public constructor(init?: Partial<ResponseCardinality>) {
    this.minimum = this.maximum = 1;
    Object.assign(this, init);
  }
}

export class Code {
  codeValue = '0';
  alignment = 'text-left';
  public constructor(init?: Partial<Code>) {
    Object.assign(this, init);
  }
}

export class Category implements IEntityEditAudit {
  id: string;
  name = '';
  label = '';
  description = '';
  hierarchyLevel = HierarchyLevel[CATEGORY_INFO[CategoryKind.CATEGORY].level];
  categoryType = CategoryKind[CategoryKind.CATEGORY];
  classKind = ElementKind[ElementKind.CATEGORY];
  inputLimit = new ResponseCardinality();
  children: Category[] = [];
  code?: Code;
  format?: any;
  changeKind?: string;
  version?: IVersion;
  xmlLang: string;
  comments: IComment[];
  public constructor(init?: Partial<Category>) {
    Object.assign(this, init);
    if (this.name && !this.label) {
      this.label = this.name;
    } else if (this.label && !this.name) {
      this.name = this.label;
    }
  }

  public setKind(kind: CategoryKind): Category {
    // if (this.description.length === 0) {
    //   this.description = CATEGORY_INFO[kind].description;
    // }
    this.hierarchyLevel = HierarchyLevel[CATEGORY_INFO[kind].level];
    this.categoryType = CategoryKind[kind];
    if (kind.valueOf() <= CategoryKind.CATEGORY) {
      this.code = new Code( { alignment: 'select', codeValue: '1' });
    }
    return this;
  }


}
