import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'qddtFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   */
  transform(items: any[], callback: (n: any) => boolean): any[] {
    if (!items) {
      return [];
    }
    if (!callback) {
      return items;
    }
    return items.filter(it => callback(it));
  }

}
