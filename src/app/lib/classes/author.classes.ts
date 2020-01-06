
export class Author {
  id: string;
  name: string;
  email: string;
  url: string;
  info: string;
  picture: string;

  public constructor(init?: Partial<Author>) {
    Object.assign(this, init);
  }
}
