import { IEntityEditAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import {Page} from '../shared/classes/classes';


export class CategoryType {

  public static element: any = [
    ['DATETIME', 'Datetime'],
    ['NUMERIC', 'Numeric'],
    ['TEXT', 'Text'],
    ['CATEGORY', 'Category']
  ];

  public static group: any = [
    ['LIST', 'List'],
    ['MISSING_GROUP', 'Missing-Group'],
    ['SCALE', 'Scale'],
    ['MIXED', 'Mixed']
  ];
}

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
  description = '';
  hierarchyLevel = '';
  categoryType = '';
  classKind = ElementKind[ElementKind.CATEGORY];
  inputLimit = new ResponseCardinality();
  children: Category[] = [];
  comments: any[];
  code = new Code();
  format: any;
  public constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}
