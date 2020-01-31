import { ElementKind } from '../enums';

export class ReferencedJson {
  entity?: string;
  kind?: ElementKind;
  modified?: number;
  antall?: number;
  refs?: string[];

  public constructor(init?: Partial<ReferencedJson>) {
    Object.assign(this, init);
  }

}
