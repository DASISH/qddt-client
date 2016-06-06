export enum DomainType {
      SCALE = 1,
      LIST,
      MIXED,
      DATETIME,
      NUMERIC,
      TEXT,
};

export const DomainTypeDescription = [
    { id: DomainType.SCALE, name: 'SCALE', label: 'Scale Domain', categoryType: 'SCALE' },
    { id: DomainType.LIST, name: 'LIST', label: 'Category List', categoryType: 'LIST' },
    { id: DomainType.MIXED, name: 'MIXED', label: 'Mixed Domain', categoryType: 'MIXED'},
    { id: DomainType.DATETIME, name: 'DATETIME', label: 'Datetime Domain', categoryType: 'DATETIME'},
    { id: DomainType.NUMERIC, name: 'NUMERIC', label: 'Numeric Domain', categoryType: 'NUMERIC'},
    { id: DomainType.TEXT, name: 'TEXT', label: 'Text Domain', categoryType: 'TEXT'}];
    // { id: DomainType.Missing, name: 'Missing', label: 'Missing Value Domain', categoryType: 'MISSING_GROUP'}];
