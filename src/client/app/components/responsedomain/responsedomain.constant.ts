export enum DomainType {
  SCALE = 1,
  LIST,
  MIXED,
  DATETIME,
  NUMERIC,
  TEXT,
  MISSING,
};

export const DomainTypeDescription = [
  { id: DomainType.SCALE, name: 'SCALE', label: 'Scale Domain', categoryType: 'SCALE' },
  { id: DomainType.LIST, name: 'LIST', label: 'Code Domain', categoryType: 'LIST' },
  { id: DomainType.MIXED, name: 'MIXED', label: 'Mixed Domain', categoryType: 'MIXED'},
  //{ id: DomainType.DATETIME, name: 'DATETIME', label: 'Datetime Domain', categoryType: 'DATETIME'},
  { id: DomainType.NUMERIC, name: 'NUMERIC', label: 'Numeric Domain', categoryType: 'NUMERIC' },
  { id: DomainType.TEXT, name: 'TEXT', label: 'Text Domain', categoryType: 'TEXT' },
  // { id: DomainType.Missing, name: 'Missing', label: 'Missing Value Domain', categoryType: 'MISSING_GROUP'}
];

export const PredefinedColumns: any = {
  'SCALE': [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true },
    { 'label': 'N', 'name': ['managedRepresentation', 'children', 'length'], 'sortable': false },
    { 'label': 'Start', 'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'sortable': false },
    { 'label': 'End', 'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'sortable': false },
    { 'label': 'Anchors', 'name': 'anchorLabel', 'sortable': false }],
  'LIST': [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true },
    { 'label': 'Number of Codes', 'name': ['managedRepresentation', 'children', 'length'], 'sortable': false }],
  'NUMERIC': [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true },
    { 'label': 'Low', 'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'sortable': false },
    { 'label': 'High', 'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'sortable': false }],
  'TEXT': [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true },
    { 'label': 'Min Length', 'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'sortable': false },
    { 'label': 'Max Length', 'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'sortable': false }],
};
