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
    return '&page=' + this.number + '&size=' + this.size + (this.sort) ? '&sort=' + this.sort : '';
  }
}
