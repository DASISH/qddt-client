export class Column {
  public name: any = null; // string or string array
  public label: String = '';          // column header
  public sortable = false;            // whether sortable
  public direction: String = '';

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }
}
