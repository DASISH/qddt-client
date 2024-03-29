import { SimpleChange } from '@angular/core';
import { QDDT_QUERY_INFOS as QDDT_QUERY_INFOS, HEADER_DETAILS } from './query-info.config';
import { ElementKind, EnumType } from '../enums';
import { QueryInfo, SelectItem } from '../classes';
import { ISelectOption, IEntityEditAudit, ITreeNode } from '../interfaces';


export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}

export function getElementKind(kind: string | ElementKind): ElementKind {
  return (typeof kind === 'string') ? ElementKind[kind] : kind;
}

export function getQueryInfo(kind: string | ElementKind): QueryInfo {
  const key = getElementKind(kind);
  return QDDT_QUERY_INFOS[key];
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
  // console.debug('haschanges');
  if ((change) && (change.currentValue)) {
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


export const isMap = <K, V>(element: Map<K, V> | any): element is Map<K, V> => {
  return (element) && (element as Map<K, V>).size !== undefined;
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

export function replaceNode(nodes: ITreeNode[], newNode: ITreeNode): ITreeNode {
  if (!nodes) { return null; }
  let i = -1;
  while (++i < nodes.length) {
    if (nodes[i].id === newNode.id) {
      nodes[i] = newNode;
      return nodes[i];
    } else {
      const retval = replaceNode(nodes[i].children, newNode);
      if (retval) {
        return retval;
      }
    }
  }
  return null;
}

// borrowed from the net.
export function saveAs(blob: Blob, fileName: string, type: string): void {
  const newBlob = new Blob([blob], { type });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  // if (window.navigator && window.navigator["msSaveOrOpenBlob"]) {
  //   window.navigator.msSaveOrOpenBlob(newBlob);
  //   return;
  // }

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


