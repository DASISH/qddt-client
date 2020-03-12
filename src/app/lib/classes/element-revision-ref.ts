import { IElement, IElementRef, IRevisionRef, IVersion, IEntityAudit } from '../interfaces';
import { ElementKind } from '../enums/element-kind';



export abstract class ElementRevisionRef implements IElementRef, IRevisionRef, IElement {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind | string;
  abstract element: any;
  name?: string;
  text?: string;
  version?: IVersion;
  public constructor(init?: Partial<ElementRevisionRef>) {
    Object.assign(this, init);
  }
}

export class ElementRevisionRefImpl<T extends IEntityAudit> extends ElementRevisionRef {
  element: T;
  public constructor(init?: Partial<ElementRevisionRef>) {
    super(init);
  }
}
