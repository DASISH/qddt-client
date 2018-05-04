import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    if (input === null || input === undefined || input.length < 3) {
      return '';
    }
    const date: Date = new Date();
    date.setUTCFullYear(input[0], input[1] - 1, input[2]);
    return date.toDateString();
  }
}
