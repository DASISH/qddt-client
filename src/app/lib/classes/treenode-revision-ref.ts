import { SequenceConstruct } from './controlconstruct.classes';
import { ElementRevisionRef } from './element-revision-ref';
import { IEntityEditAudit } from '../interfaces';

import * as uuid from 'uuid';

export abstract class TreeNodeRevisionRef extends ElementRevisionRef {
  id: string;
  children: TreeNodeRevisionRef[];

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
  public constructor(init?: Partial<ElementRevisionRef>) {
    super(init);
    this.elementKind = this.elementKind || this.element.classKind;
    if (isSequence(this.element)) {
      this.children = this.element.sequence.map(seq => new TreeNodeRevisionRefImpl(seq));
    }
  }
}


const isSequence = (element?: any | SequenceConstruct): element is SequenceConstruct =>
  (element) && (element as SequenceConstruct).sequence !== undefined;
