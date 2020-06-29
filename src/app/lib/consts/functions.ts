import { QDDT_QUERY_INFOES, HEADER_DETAILS } from './query-info.config';
import { ElementKind, EnumType } from '../enums';
import { QueryInfo, SelectItem, Parameter } from '../classes';
import { ISelectOption } from '../interfaces';


export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}

export function getElementKind(kind: string | ElementKind): ElementKind {
  return (typeof kind === 'string') ? ElementKind[kind] : kind;
}

export function getQueryInfo(kind: string | ElementKind): QueryInfo {
  const key = getElementKind(kind);
  return QDDT_QUERY_INFOES[key];
}


export function getIcon(kind: ElementKind | string): string {
  const item = Array.from(HEADER_DETAILS.values()).find(e => e.kind === getElementKind(kind));
  return item ? item.icon : 'help';
}


// export function enumValues<E>(e: E): (keyof E)[] {
//   return Object.values(e) as (keyof E)[];
// }


export function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}

export function tryParse(obj: string): boolean {
  try { return Function('"use strict";return (' + obj + ')')(); }
  catch (ex) {
    // console.log('parse: ' + obj);
    return false;
  }
}


export function toMap(enumerable: EnumType): [string, string][] {
  return Object.keys(enumerable)
    .filter(x => typeof x === 'string')
    .map(val => [enumerable[val], val]);
}

export function toSelectItems(enumerable: EnumType): ISelectOption[] {
  let i = -1;
  const keys = Object.keys(enumerable);
  return Object.values(enumerable)
    .filter(x => typeof x === 'string')
    .map(val => new SelectItem({
      id: ++i,
      label: (isNaN(Number(keys[i]))) ? keys[i] : val,
      value: (+enumerable[val] === i) ? val : enumerable[keys[i]]
    }));
}


// IS tester

export const isParamTrue = (parameter: Parameter) => {
  if (parameter.value && parameter.value.length > 0) {
    // console.log('parameter: ' + parameter.value[0]);
    return (parameter.value[0].value === 'true')
  } else {
    return false;
  }
}

export const isString = (value: string | any): value is string => {
  return (value as string) !== undefined;
}

export const StringIsNumber = value => isNaN(Number(value)) === false;

