import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortPipe implements PipeTransform {

  transform(array: any, field: string) {
    if (!Array.isArray(array)) {
      return;
    }
    console.log(array)


    array.sort((a, b) => {
      console.log(a[field], b[field], +a[field] - +b[field])
      return +a[field] - +b[field]
    });
    console.log(array)
    return array;
  }
}
