import { IElement, IElementRef, IRevisionRef, IVersion, IEntityEditAudit, IRevId } from '../interfaces';
import { ElementKind } from '../enums';



export abstract class ElementRevisionRef implements IElement, IRevisionRef {
  uri: IRevId = { id: "", rev: 0 };
  elementKind: ElementKind | string;
  name?: string;
  text?: string;
  version?: IVersion = { major: 1, minor: 0 };
  index?: number;
  abstract element: any;

  get elementId() { return this.uri?.id }
  set elementId(id: string) { this.uri.id = id }
  get elementRevision() { return this.uri?.rev }
  set elementRevision(rev: number) { this.uri.rev = rev }


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
    this.elementKind = init.elementKind || this.element.classKind;
    if (this.element) {
      this.version = this.element.version;
      if (!this.uri.id) {
        this.uri.id = this.element.id
        this.uri.rev = this.element.version.rev
      }
    }

  }
}
