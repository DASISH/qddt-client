import { SequenceConstruct, AbstractControlConstruct } from './controlconstruct.classes';
import { ElementRevisionRef } from './element-revision-ref';
import { IEntityEditAudit } from '../interfaces';
import { Parameter, getParameterKind, ParameterKind } from './instrument.classes';

import * as uuid from 'uuid';


export abstract class TreeNodeRevisionRef extends ElementRevisionRef {
  id: string;
  parameters: Parameter[] = [];
  children: TreeNodeRevisionRef[] = [];

  public constructor(init?: Partial<TreeNodeRevisionRef>) {
    super();
    Object.assign(this, init);
    if (!init.id) {
      this.id = uuid.v4();
    }
  }
}

export class TreeNodeRevisionRefImpl<T extends IEntityEditAudit> extends TreeNodeRevisionRef {
  element: T;

  public constructor(init?: Partial<TreeNodeRevisionRef>) {
    super(init);
    this.elementKind = this.elementKind || this.element.classKind;
    if (isSequence(this.element)) {
      this.children = this.element.sequence.map(seq => new TreeNodeRevisionRefImpl(seq));
    }
  }
}

export const mergeParameters = (node: TreeNodeRevisionRefImpl<AbstractControlConstruct>) => {
  // update params from source, delete if no match
  // insert no match params in source
  // console.log('mergeParameters');
  const paramOut = node.parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.OUT));
  const paramIn = node.parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.IN));

  node.element.parameterOut.forEach(po => {
    const found = paramOut.find(f => f.name === po.name);
    if (found) {
      po = found;
    } else {
      console.log('parameters.push(po)');
      po.id = node.id;
      node.parameters.push(po);
    }
  });

  node.element.parameterIn.forEach(pi => {
    const found = paramIn.find(pi2 => pi2.name === pi.name);
    if (found) {
      pi = found;
    } else {
      console.log('parameters.push(pi)');
      node.parameters.push(pi);
    }
  });

}


const isSequence = (element?: any | SequenceConstruct): element is SequenceConstruct =>
  (element) && (element as SequenceConstruct).sequence !== undefined;
