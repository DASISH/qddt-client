/*
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
*/

export class Page {
  number = 0;
  size = 10;
  totalElements?: number;
  totalPages?: number;
  sort = '';  // default to no sort

  public constructor(init?: Partial<Page>) {
    Object.assign(this, init);
  }


  public queryPage(): string {
    let query = '&page=' + this.number.toString();
    query += '&size=' + this.getSize();
    query += (this.sort) ? '&sort=' + this.sort : '';
    return query;
  }

  private getSize(): string {
    return (this.size) ? this.size.toString() : '10';
  }
}
