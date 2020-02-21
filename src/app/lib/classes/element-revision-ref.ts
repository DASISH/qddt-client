import { IElement, IElementRef, IRevisionRef, IVersion, IEntityEditAudit } from '../interfaces';
import { ElementKind } from '../enums';

export class ElementRevisionRef<T extends IEntityEditAudit> implements IElementRef, IRevisionRef, IElement {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind | string;
  element: T;
  name?: string;
  text?: string;
  version?: IVersion;
  public constructor(init?: Partial<ElementRevisionRef>) {
    Object.assign(this, init);
  }
}
