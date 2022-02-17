import { IElement, IElementRef, IRevisionRef, IVersion, IEntityEditAudit } from '../interfaces';
import { ElementKind } from '../enums';



export abstract class ElementRevisionRef implements IElementRef, IRevisionRef, IElement {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind | string;
  abstract element: any;
  name?: string;
  text?: string;
  version?: IVersion = { major: 1, minor: 0 };
  index?: number;
  public constructor(init?: Partial<ElementRevisionRef>) {
    Object.assign(this, init);
  }
  toString(): string {
    return this.name;
  }

}

export class ElementRevisionRefImpl<T extends IEntityEditAudit> extends ElementRevisionRef {
  element: T;
  public constructor(init?: Partial<ElementRevisionRef>) {
    super(init);
    this.elementKind = this.elementKind || this.element.classKind;
    // this.version = (this.element) ? this.element.version;
  }
}
