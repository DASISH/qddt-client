import { QDDT_QUERY_INFOES, HEADER_DETAILS } from './query-info.config';
import { ElementKind, EnumType } from '../enums';
import { QueryInfo, SelectItem, Parameter } from '../classes';
import { ISelectOption, IEntityEditAudit } from '../interfaces';
import { SimpleChange } from '@angular/core';


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

export function tryParse(obj: string) {
  try { return Function('"use strict";return (' + obj + ')')(); }
  catch (ex) {
    return false;
  }
}

export const delay = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));


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

export function hasChanges<T>(change?: SimpleChange, comparar?: (a: T, b: T) => boolean): boolean {
  if (change && change.currentValue) {
    if (!change.previousValue) {
      return true;
    }
    return (comparar) ?
      !comparar(change.previousValue, change.currentValue) :
      (change.previousValue !== change.currentValue);
  }
  return false;
}

// IS tester

export const isParamTrue = (parameter: Parameter) => {
  if (parameter && parameter.value && parameter.value.length > 0) {
    return (parameter.value[0].value === true || parameter.value[0].value === 'true')
  } else {
    return false;
  }
}

export const isIEntityEditAudit = (element: IEntityEditAudit | any): element is IEntityEditAudit => {
  return (element) && (element as IEntityEditAudit).modified !== undefined;
}


export const isString = (value: string | any): value is string => {
  return (typeof value === 'string') ? (value as string) !== undefined : false;
}

export const isBoolean = (expression: boolean | any): expression is boolean => {
  return (expression) && (typeof expression === 'boolean');
}

export const isObject = (value: object | any): value is object => {
  return value !== null && typeof value === 'object';
}


export const StringIsNumber = value => isNaN(Number(value)) === false;


// borrowed from the net.
export function saveAs(blob: Blob, fileName: string, type: string): void {
  const newBlob = new Blob([blob], { type });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const objectURL = window.URL.createObjectURL(newBlob);

  const link = document.createElement('a');
  link.href = objectURL;
  link.download = fileName;
  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(objectURL);
    link.remove();
  }, 100);
}
