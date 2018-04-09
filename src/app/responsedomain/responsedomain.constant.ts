export enum DomainKind {
  NONE = 0,
  SCALE,
  LIST,
  MIXED,
  NUMERIC,
  DATETIME,
  TEXT,
  MISSING,
}

export const DomainTypeDescription = [
  { id: DomainKind.SCALE, name: 'SCALE', label: 'Scale Domain', categoryType: 'SCALE' },
  { id: DomainKind.LIST, name: 'LIST', label: 'Code Domain', categoryType: 'LIST' },
  { id: DomainKind.MIXED, name: 'MIXED', label: 'Mixed Domain', categoryType: 'MIXED'},
  { id: DomainKind.NUMERIC, name: 'NUMERIC', label: 'Numeric Domain', categoryType: 'NUMERIC' },
  { id: DomainKind.TEXT, name: 'TEXT', label: 'Text Domain', categoryType: 'TEXT' },
  { id: DomainKind.DATETIME, name: 'DATETIME', label: 'DateTime Domain', categoryType: 'DATETIME' },
];
