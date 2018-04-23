import { Category, ResponseCardinality, CategoryKind } from '../category/category.classes';
import { IEntityAudit, IEntityEditAudit, IVersion } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';

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

export const DATE_FORMAT: any = [
  {'id': 1, 'format': 'yyyy-mm-dd',         'label': 'Date' },
  {'id': 2, 'format': 'yyyy-mm-dd HH:mm:SS', 'label': 'DateTime' },
  {'id': 3, 'format': 'dd',                 'label': 'gDay' },
  {'id': 4, 'format': 'mm',                 'label': 'gMonth' },
  {'id': 5, 'format': 'mm-dd',              'label': 'gMonthDay' },
  {'id': 6, 'format': 'yyyy',               'label': 'gYear' },
  {'id': 7, 'format': 'yyyy-mm',            'label': 'gYearMonth' },
  {'id': 8, 'format': 'HH:mm:SS',           'label': 'Time' },
  {'id': 9, 'format': 'd mmm yyyy',         'label': 'Date-text-short' },
  {'id': 10, 'format': 'dddd d mmmm yyyy',  'label': 'Full-date-text' },
];

export const DOMAIN_TYPE_DESCRIPTION = [
  { id: DomainKind.NONE },
  { id: DomainKind.SCALE, label: 'Scale Domain', categoryType: CategoryKind.SCALE },
  { id: DomainKind.LIST, label: 'Code Domain', categoryType: CategoryKind.LIST },
  { id: DomainKind.NUMERIC, label: 'Numeric Domain', categoryType: CategoryKind.NUMERIC },
  { id: DomainKind.DATETIME, label: 'DateTime Domain', categoryType: CategoryKind.DATETIME },
  { id: DomainKind.TEXT, label: 'Text Domain', categoryType: CategoryKind.TEXT },
  { id: DomainKind.MISSING, label: 'Missing Domain', categoryType: CategoryKind.MISSING_GROUP },
  { id: DomainKind.MIXED, label: 'Mixed Domain', categoryType: CategoryKind.MIXED},
];


export class ResponseDomain implements IEntityEditAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  displayLayout = '0';
  managedRepresentation: Category = new Category();
  responseCardinality: ResponseCardinality = new ResponseCardinality();
  responseKind: string = DomainKind[DomainKind.NONE];
  classKind: string = ElementKind[ElementKind.RESPONSEDOMAIN];
  comments?: any[];

  agency?: IEntityAudit;
  basedOnObject?: string;
  basedOnRevision?: number;
  modified?: number;
  version?: IVersion;

  public constructor(init?: Partial<ResponseDomain>) {
    Object.assign(this, init);
  }

  public setResponseKind(kind: DomainKind): ResponseDomain {
    this.responseKind = DomainKind[kind];
    this.managedRepresentation.setKind(DOMAIN_TYPE_DESCRIPTION[kind].categoryType);
    return this;
  }

  public addManagedRep(rep: Category) {
    if (this.responseKind === 'MIXED') {
      if (rep.categoryType === 'MISSING_GROUP') {
        const index = this.managedRepresentation.children.findIndex(e => e.categoryType === 'MISSING_GROUP');
        if (index >= 0) {
          this.managedRepresentation.children = this.managedRepresentation.children.slice(index, 1);
        }
      } else {

      }
      this.managedRepresentation.children.push(rep);
      this.name += ' ' + rep.name;
    }
  }

  public isMixed(): boolean {
    return (this.responseKind === 'MIXED');
  }

  public getMissing(): Category {
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

}

export function makeMixed(old: ResponseDomain): ResponseDomain {
  const managedRepresentation = new Category({
    description: '[Mixed] group - ' + old.managedRepresentation.name + '...]',
    hierarchyLevel: 'GROUP_ENTITY',
    categoryType: 'MIXED',
    children: [old.managedRepresentation] });

  return new ResponseDomain({
    responseKind: 'MIXED',
    name: old.name,
    description: 'Mixed [' + old.description + '...]',
    displayLayout: old.displayLayout,
    managedRepresentation: managedRepresentation,
    responseCardinality: old.responseCardinality });
}
