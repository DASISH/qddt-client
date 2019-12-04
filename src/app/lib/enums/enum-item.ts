import { map } from 'rxjs/operators';

export interface EnumType { [s: number]: string; }

export interface EnumItem {
  id: number;
  value: any;
  label: string;
}

export function toEnumItems(enumerable: EnumType): EnumItem[] {
  const keys = Object.keys(enumerable);
  return Object.values(enumerable)
    .filter(x => typeof x === 'string')
    .map( val => {
      return { id: +enumerable[val], value: enumerable[keys[+enumerable[val]]], label: val};
    } );
}
