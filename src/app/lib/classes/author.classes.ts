import { IEntityEditAudit } from '../interfaces';
import { ElementKind } from '../enums';

export class Author implements IEntityEditAudit {
  id: string;
  name: string;
  email: string;
  about: string;
  homepage: string;
  picture: string;
  authorsAffiliation: string;
  classKind = ElementKind[ElementKind.AUTHOR];
  xmlLang = 'none';

  public constructor(init?: Partial<Author>) {
    Object.assign(this, init);
  }
}
