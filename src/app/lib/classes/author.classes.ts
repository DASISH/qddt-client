import {IEntityEditAudit} from '../interfaces';

export class Author implements IEntityEditAudit {
  id: string;
  name: string;
  email: string;
  url: string;
  info: string;
  picture: string;
  classKind: string;
  xmlLang?: string;

  public constructor(init?: Partial<Author>) {
    Object.assign(this, init);
  }

}
