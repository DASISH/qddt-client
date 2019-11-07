import {QDDT_QUERY_INFOES} from './query-info.config';
import {ElementKind} from '../enums';
import {QueryInfo} from '../classes';

export const StringIsNumber = value => isNaN(Number(value)) === false;

export function getElementKind(kind: string|ElementKind): ElementKind {
  return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
}

export function getQueryInfo(kind: string|ElementKind): QueryInfo {
  const key = getElementKind(kind);
  return QDDT_QUERY_INFOES[key];
}

export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}


export function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}


