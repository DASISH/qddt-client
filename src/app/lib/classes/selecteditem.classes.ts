import { ISelectItem } from '../interfaces/interfaces';

export class SelectedItem implements ISelectItem {
  id: number;
  text: string;
  value?: any;
  children?: ISelectItem[];

  public constructor(init?: Partial<ISelectItem>) {
    Object.assign(this, init);
    if (!this.value) {
      this.value = this.text;
    }
  }
}
