
export class Column {
  public name: any; // string|string[]; can't use this. join complains...
  public label = '';                    // column header
  public sortable = false;              // whether sortable
  public direction = '';                // '' | 'asc' | 'desc'

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }

  public nextSort(): string {
    if (this.sortable) {
      switch (this.direction) {
        case '': this.direction = 'asc';
          break;
        case 'asc': this.direction =  'desc';
          break;
        default: this.direction = '';
          break;
      }
    }
    return this.direction;
  }

}
