import { IEntityEditAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { Page } from '../shared/classes/classes';
import { ParseErrorLevel } from '@angular/compiler';


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

export enum HierachyLevel { ENTITY, GROUP_ENTITY }

export interface ICategoryInfo {
  kind: CategoryKind;
  level: HierachyLevel;
  description: string;
}

export const CATEGORY_INFO: ICategoryInfo[] = [
  {kind: CategoryKind.DATETIME, level: HierachyLevel.ENTITY , description: 'Datetime'},
  {kind: CategoryKind.TEXT, level: HierachyLevel.ENTITY , description: 'Text'},
  {kind: CategoryKind.NUMERIC, level: HierachyLevel.ENTITY , description: 'Numeric'},
  {kind: CategoryKind.DATETIME, level: HierachyLevel.ENTITY , description: 'Boolean'},
  {kind: CategoryKind.URI, level: HierachyLevel.ENTITY , description: 'Uniform Resource Identifier'},
  {kind: CategoryKind.CATEGORY, level: HierachyLevel.ENTITY , description: 'Code'},
  {kind: CategoryKind.MISSING_GROUP, level: HierachyLevel.GROUP_ENTITY , description: 'CodeList Missing value'},
  {kind: CategoryKind.LIST, level: HierachyLevel.GROUP_ENTITY , description: 'CodeList'},
  {kind: CategoryKind.SCALE, level: HierachyLevel.GROUP_ENTITY , description: 'ScaleDomain'},
  {kind: CategoryKind.MIXED, level: HierachyLevel.GROUP_ENTITY , description: 'Mixed Mananged representation'},
];

export class ResponseCardinality {
  minimum: number;
  maximum: number;
  constructor() {
    this.minimum = 1;
    this.maximum = 1;
  }
}

export class Code {
  codeValue: string;
  alignment: string;
  constructor() {
    this.alignment = 'text-left';
    this.codeValue = '0';
  }
}

export class Category implements IEntityEditAudit {
  id: string;
  name = '';
  label = '';
  description =  CATEGORY_INFO[CategoryKind.CATEGORY].description;
  hierarchyLevel = CATEGORY_INFO[CategoryKind.CATEGORY].level.toString();
  categoryType = CategoryKind[CategoryKind.CATEGORY];
  classKind = ElementKind[ElementKind.CATEGORY];
  inputLimit = new ResponseCardinality();
  children: Category[] = [];
  comments?: any[];
  code?: Code;
  format?: any;
  public constructor(init?: Partial<Category>) {
    Object.assign(this, init);
    if (this.name && !this.label) {
      this.label = this.name;
    } else if (this.label && !this.name) {
      this.name = this.label;
    }
  }

  public setKind(kind: CategoryKind): Category {
    this.description =  CATEGORY_INFO[kind].description;
    this.hierarchyLevel = CATEGORY_INFO[kind].level.toString();
    this.categoryType = CategoryKind[kind];
    return this;
  }
}
