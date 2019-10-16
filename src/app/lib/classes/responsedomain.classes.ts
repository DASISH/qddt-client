import {Category, CategoryKind, ResponseCardinality} from './category.classes';
import {IEntityAudit, IEntityEditAudit, IVersion} from '../interfaces';
import {ElementKind} from '../enums';

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
  { id: DomainKind.NONE, label: '', categoryType: null },
  { id: DomainKind.SCALE, label: 'Scale Domain', categoryType: CategoryKind.SCALE },
  { id: DomainKind.LIST, label: 'Code Domain', categoryType: CategoryKind.LIST },
  { id: DomainKind.NUMERIC, label: 'Numeric Domain', categoryType: CategoryKind.NUMERIC },
  { id: DomainKind.DATETIME, label: 'DateTime Domain', categoryType: CategoryKind.DATETIME },
  { id: DomainKind.TEXT, label: 'Text Domain', categoryType: CategoryKind.TEXT },
  { id: DomainKind.MISSING, label: 'Missing Domain', categoryType: CategoryKind.MISSING_GROUP },
  { id: DomainKind.MIXED, label: 'Mixed Domain', categoryType: CategoryKind.MIXED},
];


export class ResponseDomain implements IEntityEditAudit {

  public constructor(init?: Partial<ResponseDomain>) {
    Object.assign(this, init);
  }

  public get isMixed() { return (this.responseKind === 'MIXED');  }

  public get missing(): Category {
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  id: string;
  name: string;
  description: string;
  displayLayout = '0';
  managedRepresentation: Category = new Category();
  responseCardinality: ResponseCardinality = new ResponseCardinality();
  responseKind: string = DomainKind[DomainKind.NONE];
  classKind: string = ElementKind[ElementKind.RESPONSEDOMAIN];
  comments?: any[];

  agency?: IEntityAudit;
  changeComment?: string;
  changeKind?: string;
  basedOnObject?: string;
  basedOnRevision?: number;
  modified?: number;
  version?: IVersion;


  public setResponseKind(kind: DomainKind): ResponseDomain {
    this.responseKind = DomainKind[kind];
    this.managedRepresentation.setKind(DOMAIN_TYPE_DESCRIPTION[kind].categoryType);
    return this;
  }

  public addManagedRep(rep: Category) {
    this.managedRepresentation.children = this.managedRepresentation.children.filter(e => e.categoryType !== rep.categoryType);

    if ( this.managedRepresentation.children.length > 0 && !this.isMixed) {
      this.managedRepresentation = new Category({
        hierarchyLevel: 'GROUP_ENTITY',
        name: 'Mixed [ named on client ]',
        children: [this.managedRepresentation]});
      this.id = null;
      this.setResponseKind(DomainKind.MIXED);
    }
      // there is no other children or this is a mixed responseDomain....
    this.managedRepresentation.children.push(rep);
    this.name = this.managedRepresentation.label =
      'Mixed (name from client) [' + this.managedRepresentation.children.map( c => c.label).join(' + ') + ']';
  }

}

// export function makeMixed(old: ResponseDomain): ResponseDomain {
//   if (this.isMixed) {
//     return old;
//   }
//
//   const rd = new ResponseDomain(old);
//   rd.setResponseKind(DomainKind.MIXED);
//   rd.
//
//   {
//
//     name: old.name,
//     displayLayout: old.displayLayout,
//     responseCardinality: old.responseCardinality
//   });
//
//   rd.addManagedRep()
//
//
//   const managedRepresentation = new Category({
//     hierarchyLevel: 'GROUP_ENTITY',
//     categoryType: 'MIXED',
//     name: old.id,
//     children: [old.managedRepresentation]
//   });
//
// }
//
//   return
