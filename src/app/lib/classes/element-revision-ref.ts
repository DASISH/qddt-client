import { IElement, IElementRef, IRevisionRef, IVersion, IEntityEditAudit } from '../interfaces';
import { ElementKind } from '../enums';


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

export class ElementRevisionRefImpl<T extends IEntityEditAudit> extends ElementRevisionRef {

  element: T;

  public constructor(init?: Partial<ElementRevisionRef>) {
    super(init);
  }

}
