/**
  Modified based on ng-bootstrap. The original license is as follows:
  The MIT License (MIT)
  Copyright (c) 2015-2016 Angular ng-bootstrap team
*/
import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy } from '@angular/core';

/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
@Component({
  selector: 'qddt-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'pagination.component.html'
})
export class QddtPaginationComponent implements OnChanges {
  pages: number[] = [];
  /**
   * Pagination display size: small or large
   */
  @Input() size: 'sm' | 'lg';

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals the current page.
   */
  @Output() pageChange = new EventEmitter<number>();

  private _boundaryLinks = false;
  private _collectionSize: any;
  private _directionLinks = true;
  private _ellipses = true;
  private _maxSize = 0;
  private _page = 0;
  private _pageCount = 0;
  private _pageSize = 20;
  private _rotate = false;

  /**
   *  Whether to show the "First" and "Last" page links
   */
  @Input()
  set boundaryLinks(value: boolean) {
    this._boundaryLinks = this.toBoolean(value);
  }

  get boundaryLinks(): boolean { return this._boundaryLinks; }

  /**
   *  Whether to show the "Next" and "Previous" page links
   */
  @Input()
  set directionLinks(value: boolean) {
    this._directionLinks = this.toBoolean(value);
  }

  get directionLinks(): boolean { return this._directionLinks; }

  /**
   *  Whether to show ellipsis symbols and first/last page numbers when maxSize > number of pages
   */
  @Input()
  set ellipses(value: boolean) {
    this._ellipses = this.toBoolean(value);
  }

  get ellipses(): boolean { return this._ellipses; }

  /**
   *  Number of items in collection.
   */
  @Input()
  set collectionSize(value: number | string) {
    this._collectionSize = this.toInteger(value);
  }

  get collectionSize(): number | string { return this._collectionSize; }

  /**
   *  Maximum number of pages to display
   */
  @Input()
  set maxSize(value: number | string) {
    this._maxSize = this.toInteger(value);
  }

  get maxSize(): number | string { return this._maxSize; }

  /**
   *  Current page.
   */
  @Input()
  set page(value: number | string) {
    this._page = parseInt(`${value}`, 10) + 1;
  }

  get page(): number | string { return this._page; }

  /**
   *  Number of items per page.
   */
  @Input()
  set pageSize(value: number | string) {
    this._pageSize = this.toInteger(value);
  }

  get pageSize(): number | string { return this._pageSize; }

  /**
   *  Whether to rotate pages when maxSize > number of pages.
   *  Current page will be in the middle
   */
  @Input()
  set rotate(value: boolean) {
    this._rotate = this.toBoolean(value);
  }

  get rotate(): boolean { return this._rotate; }

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this._pageCount; }

  selectPage(pageNumber: number): void {
    const prevPageNo = this.page;
    this._page = this._getPageNoInRange(pageNumber);

    if (this.page !== prevPageNo) {
      this.pageChange.emit(this._page - 1);
    }

    this.ngOnChanges();
  }

  ngOnChanges(): void {
    // re-calculate new length of pages
    this._pageCount = Math.ceil(this._collectionSize / this._pageSize);

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this._pageCount; i++) {
      this.pages.push(i);
    }

    // get selected page
    this._page = this._getPageNoInRange(this.page);

    // apply maxSize if necessary
    if (this._maxSize > 0 && this._pageCount > this._maxSize) {
      let start = 0;
      let end = this._pageCount;

      // either paginating or rotating page numbers
      if (this._rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }

  _isEllipsis(pageNumber: number): boolean { return pageNumber === -1; }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this._ellipses) {
      if (start > 0) {
        this.pages.unshift(-1);
        this.pages.unshift(1);
      }
      if (end < this._pageCount) {
        this.pages.push(-1);
        this.pages.push(this._pageCount);
      }
    }
  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private _applyRotation(): [number, number] {
    let start = 0;
    let end = this._pageCount;
    const leftOffset = Math.floor(this._maxSize / 2);
    const rightOffset = this._maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this._page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this._maxSize;
    } else if (this._pageCount - this._page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this._pageCount - this._maxSize;
    } else {
      // rotate
      start = this._page - leftOffset - 1;
      end = this._page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page
   */
  private _applyPagination(): [number, number] {
    const page = Math.ceil(this._page / this._maxSize) - 1;
    const start = page * this._maxSize;
    const end = start + this._maxSize;

    return [start, end];
  }

  private _getPageNoInRange(newPageNo: any): number { return this.getValueInRange(newPageNo, this._pageCount, 1); }

  private toBoolean(value: any): boolean {
    return value === '' ? true : !!value;
  }

  private toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  private getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }

}
