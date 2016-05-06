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
    { id: DomainType.Scale, name: 'Scale', label: 'Scale Domain', support: [] },
    {
        id: DomainType.CodeList, name: 'Code', label: 'Code List',
    },
    {
        id: DomainType.CategoryList, name: 'Category', label: 'Category List',
    },
    { id: DomainType.Datetime, name: 'Datetime', label: 'Datetime Domain'},
    { id: DomainType.Numeric, name: 'Numeric', label: 'Numeric Domain'},
    { id: DomainType.Text, name: 'Text', label: 'Text Domain'},
    { id: DomainType.Missing, name: 'Missing', label: 'Missing Value Domain'}];
