export enum DomainType {
    Scale = 1,
    CodeList,
    CategoryList,
    Datetime,
    Numeric,
    Text,
    Missing,
};

export const DomainTypeDescription = [
    { id: DomainType.Scale, name: 'Scale', label: 'Scale Domain', categoryType: 'LIST' },
    {
        id: DomainType.CodeList, name: 'List', label: 'Code List', categoryType: 'LIST'
    },
    {
        id: DomainType.CategoryList, name: 'List', label: 'Category List', categoryType: 'LIST'
    },
    { id: DomainType.Datetime, name: 'Datetime', label: 'Datetime Domain', categoryType: 'LIST'},
    { id: DomainType.Numeric, name: 'Numeric', label: 'Numeric Domain', categoryType: 'RANGE'},
    { id: DomainType.Text, name: 'Text', label: 'Text Domain', categoryType: 'LIST'},
    { id: DomainType.Missing, name: 'Missing', label: 'Missing Value Domain', categoryType: 'MISSING_GROUP'}];
