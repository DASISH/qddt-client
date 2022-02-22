import { IElement, IElementRef, IRevisionRef, IVersion, IEntityEditAudit, IRevId } from '../interfaces';
import { ElementKind } from '../enums';



export abstract class ElementRevisionRef implements IElement, IRevisionRef {
  uri: IRevId;
  elementKind: ElementKind | string;
  name?: string;
  version?: IVersion = { major: 1, minor: 0 };

  get elementId() { return this.uri.id }
  get elementRevision() { return this.uri.rev }

  abstract element: any;

  text?: string;
  index?: number;
  public constructor(init?: Partial<ElementRevisionRef>) {
    Object.assign(this, init);
  }

  toString(): string {
    return this.name;
  }
  equal(revId: IRevId): boolean {
    return this.uri.id === revId.id && this.uri.rev == revId.rev
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
