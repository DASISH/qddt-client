import {IElement, IIdRef, IRevisionRef, IVersion} from '../interfaces';
import {ElementKind} from '../enums';

export class ElementRevisionRef implements IIdRef, IRevisionRef, IElement {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind | string;
  element: any;
  name?: string;
  version?: IVersion;
  public constructor(init?: Partial<ElementRevisionRef>) {
    Object.assign(this, init);
  }
}
