import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) protected localID: string) { }

  // transform(input: Array<number>): string {
  //   if (input === null || input === undefined || input.length < 3) {
  //     return '';
  //   }
  //   const date: Date = new Date();
  //   date.setUTCFullYear(input[0], input[1] - 1, input[2]);
  //   return date.toDateString();
  // }

  transform(value: any, format?: string) {

    if (!value) { return ''; }
    if (!format) { format = 'shortDate'; }

    return formatDate(value, format, this.localID);
  }
}
