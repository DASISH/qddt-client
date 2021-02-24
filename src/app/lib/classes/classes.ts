import { ElementKind } from '../enums';
import { IEntityAudit, IPageSearch, IRevisionResult, IUser, ISurveyOrder } from '../interfaces';

export class QueryInfo {
  id: ElementKind;
  label: string;
  path: string;
  halName: string;
  fields: string[];
  parameter: string;

  constructor(id: ElementKind, label: string, path: string, halName: string, fields: any[], parameter: string) {
    this.id = id;
    this.label = label;
    this.path = path;
    this.halName = halName;
    this.fields = fields;
    this.parameter = parameter;
  }

  isMultipleFields(): boolean {
    return (this.fields.length > 1);
  }

  placeholder(): string {
    let message = 'Searches in [';
    this.fields.forEach(o => {
      message += o.toLowerCase() + ' and ';
    });
    return message.slice(0, message.length - 5) + ']';
  }
}


const lowerFirstLetter = ([first, ...rest]: string, locale = navigator.language) =>
  first.toLocaleLowerCase(locale) + rest.join('')


export class RevisionResult<T extends IEntityAudit> {
  entity: T;
  revisionModifiedBy: IUser;
  revisionDate: any;
  revisionNumber: number;
  constructor(init?: Partial<IRevisionResult<T>>) {
    this.entity = init.entity;
    this.revisionDate = init.metadata.revisionDate;
    this.revisionNumber = init.metadata.revisionNumber;
    this.revisionModifiedBy = init.metadata.delegate.modifiedBy;
  }
}


/*
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
*/
export class Page {
  number = 0;
  size = 10;
  totalElements?: number;
  totalPages?: number;

  public constructor(init?: Partial<Page>) {
    Object.assign(this, init);
  }


  public queryPage(): string {
    let query = '&page=' + this.number.toString();
    query += '&size=' + this.getSize();
    return query;
  }

  private getSize(): string {
    return (this.size) ? this.size.toString() : '10';
  }
}


export class PageSearch implements IPageSearch {
  kind: ElementKind;
  key = '';
  hasDetailSearch = false;
  keys: Map<string, string> = new Map([]);
  xmlLang: string;
  page = new Page();
  sort = 'modified,desc';

  public constructor(init?: Partial<IPageSearch>) {
    Object.assign(this, init);
    if (!this.xmlLang) {
      this.xmlLang = 'none';
    }
  }
}


export class SurveyOrder implements ISurveyOrder {
  uuid: string;
  index: number;
  public constructor(init?: Partial<ISurveyOrder>) {
    Object.assign(this, init);
  }
}
