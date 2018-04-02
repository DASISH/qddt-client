export class Column {
  public name: any = null; // string or string array
  public label = '';          // column header
  public sortable = false;            // whether sortable
  public direction = '';

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }
}
