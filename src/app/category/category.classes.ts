import { IEntityEditAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';


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
  name: string;
  classKind = ElementKind[ElementKind.CATEGORY];
  label: string;
  description: string;
  inputLimit: ResponseCardinality;
  hierarchyLevel: string;
  categoryType: string;
  children: Category[];
  comments: any[];
  code: Code;
  format: any;
  constructor() {
    this.label = '';
    this.name = '';
    this.children = [];
    this.inputLimit = new ResponseCardinality();
    this.code = new Code();
  }
}
