export interface IPassword {
  id: string;
  password: string;
  oldPassword?: string;
  confirm?: string;
}


export class Password implements IPassword {
  id: string;
  password: string;
  oldPassword?: string;
  confirm?: string;

  public constructor(init?: Partial<IPassword>) {
    Object.assign(this, init);
  }
}
