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

export function toMap(enumerable: EnumType): [string, string][] {
  return Object.keys(enumerable)
    .filter(x => typeof x === 'string')
    .map( val => [ enumerable[val], val ] );
}

export function toValueMap(enumerable: EnumType): [string, string][] {
  return Object.values(enumerable)
    .filter(x => typeof x === 'string')
    .map( val => [val , val ] );
}



// export function fromValue<T>(o: T, value: string): { [P in keyof T]: T[P]  }[keyof T] {
//   return  (o as any)[value]; // No type safety here unfrotunately
// }
