import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'qddtFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], callback: (n: any) => boolean): any[] {
    if (!items) {
      return [];
    }
    if (!callback) {
      return items;
    }
    return items.filter(it => callback(it));
    // return items.filter(it => {
    //   const result = callback(it);
    //   console.log(result);
    //   return result;
    // });
  }

}
