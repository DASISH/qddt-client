import { ISelectOption } from '../interfaces';

export class SelectItem implements ISelectOption {
  id: number;
  label: string;
  value?: any;
  ref?: any
  children?: ISelectOption[];

  public constructor(init?: Partial<ISelectOption>) {
    this.id = init.id;
    this.label = init.label;
    this.value = init.value || init.id;

    const values = Object.entries(init).filter( f => f[0] !== 'children');
    if (values.length > 3) {
      const source =  '{ ' + values.map(key => `"${key[0]}": "${key[1]}"`).join(' ,') + ' }';
      this.ref = JSON.parse(source);
    }
    if (init.children && init.children.length > 0) {
      this.children = init.children.map(child => new SelectItem(child));
    }
  }

}

