import { HalLink, IComment, IEntityEditAudit, IOtherMaterial, IRevId, IVersion } from '../interfaces';
import { ElementKind } from '../enums';
import { User, Agency } from './user.classes';

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
