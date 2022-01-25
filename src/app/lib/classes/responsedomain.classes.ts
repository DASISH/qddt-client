import { Category, CategoryKind, ResponseCardinality } from './category.classes';
import { HalLink, IEntityEditAudit, IRevId, ISelectOption, IVersion} from '../interfaces';
import { ElementKind } from '../enums';

export enum DomainKind {
  NONE = 0,
  SCALE,
  LIST,
  NUMERIC,
  DATETIME,
  TEXT,
  MISSING,
  MIXED,
}

export const DATE_FORMAT_MAP: ISelectOption[] = [
  { id: 0, value: 'yyyy-mm-dd', label: 'Date', description: 'shortDate' },
  { id: 1, value: 'yyyy-mm-dd HH:MM:SS', label: 'DateTime', description: 'short' },
  { id: 2, value: 'dd', label: 'gDay', description: 'd' },
  { id: 3, value: 'mm', label: 'gMonth', description: 'M' },
  { id: 4, value: 'mm-dd', label: 'gMonthDay', description: 'M-d' },
  { id: 5, value: 'yyyy', label: 'gYear', description: 'y' },
  { id: 6, value: 'yyyy-mm', label: 'gYearMonth', description: 'y-M' },
  { id: 7, value: 'd mmm yyyy', label: 'Date-text-short', description: 'd MMM y' },
  { id: 8, value: 'dddd d mmmm yyyy', label: 'Full-date-text', description: 'fullDate' },
  { id: 9, value: 'PTnHnM', label: 'Duration', description: 'Duration in hours and minutes' },
];

// { id: 7, value: 'HH:mm:SS', label: 'Time', description: '' },

export const DOMAIN_TYPE_DESCRIPTION = [
  { id: DomainKind.NONE, label: '', categoryKind: null },
  { id: DomainKind.SCALE, label: 'Scale Domain', categoryKind: CategoryKind.SCALE },
  { id: DomainKind.LIST, label: 'Code Domain', categoryKind: CategoryKind.LIST },
  { id: DomainKind.NUMERIC, label: 'Numeric Domain', categoryKind: CategoryKind.NUMERIC },
  { id: DomainKind.DATETIME, label: 'DateTime Domain', categoryKind: CategoryKind.DATETIME },
  { id: DomainKind.TEXT, label: 'Text Domain', categoryKind: CategoryKind.TEXT },
  { id: DomainKind.MISSING, label: 'Missing Domain', categoryKind: CategoryKind.MISSING_GROUP },
  { id: DomainKind.MIXED, label: 'Mixed Domain', categoryKind: CategoryKind.MIXED },
];

export class UserResponse {
  label: string;
  value: any;
  checked?: boolean;
  disabled?: string;
  isMissing?: boolean;
  public constructor(init?: Partial<UserResponse>) {
    Object.assign(this, init);
  }
}


export class ResponseDomain implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  displayLayout = '0';
  // managedRepresentation: Category = new Category();
  responseCardinality: ResponseCardinality = new ResponseCardinality();
  responseKind: string = DomainKind[DomainKind.NONE];
  classKind: string = ElementKind[ElementKind.RESPONSEDOMAIN];
  comments?: any[];

  // agency?: Agency;
  changeComment?: string;
  changeKind?: string;
  basedOn?: IRevId;

  modified?: number;
  version?: IVersion = { major: 0, minor: 0 };
  xmlLang?: string;
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };

  get managedRepresentation(): Category {
    if (!this._embedded.managedRepresentation)
      this.managedRepresentation = new Category().setKind(DOMAIN_TYPE_DESCRIPTION[DomainKind[this.responseKind]].categoryKind)
      // console.debug(this._embedded.managedRepresentation)
    return this._embedded.managedRepresentation
  }
  set managedRepresentation(value) {
    this._embedded.managedRepresentation = value;
  }
  public constructor(init?: Partial<ResponseDomain>) {
    Object.assign(this, init);
    if (init && init.xmlLang) {
      if (!this._embedded)
        this._embedded = {};

      // if (this._embedded.managedRepresentation) {
      // this.managedRepresentation = this._embedded.managedRepresentation
      // this._embedded.managedRepresentation = null
    }
  }

  public get isMixed() { return (this.responseKind === 'MIXED'); }

  public get missing(): Category {
    return this.managedRepresentation.children.find(e => e.categoryKind === 'MISSING_GROUP');
  }

  public setResponseKind(kind: DomainKind): ResponseDomain {
    this.responseKind = DomainKind[kind];
    this.managedRepresentation.setKind(DOMAIN_TYPE_DESCRIPTION[kind].categoryKind);
    if (kind === DomainKind.SCALE) {
      this.managedRepresentation.inputLimit = { minimum: 1, maximum: 5, stepUnit: 1 }
    } else if (kind === DomainKind.DATETIME) {
      this.managedRepresentation.inputLimit = { minimum: 1950, maximum: 2050, stepUnit: 1 }

    }
    return this;
  }

  public addManagedRep(rep: Category) {
    if (!this.isMixed) {
      this.managedRepresentation = new Category({
        name: 'Mixed [ renamed in service ]',
        xmlLang: this.xmlLang,
        children: [this.managedRepresentation]
      });
      this.id = null;
      this.setResponseKind(DomainKind.MIXED);
    }
    const filtered = this.managedRepresentation.children.filter(e => e.categoryKind !== rep.categoryKind);
    filtered.push(rep);
    // there is no other children or this is a mixed responseDomain....
    this.managedRepresentation.children = filtered;
    this.name = this.managedRepresentation.label =
      'Mixed (' + this.managedRepresentation.children.map(c => c.label).join(' + ') + ')';
  }

}

