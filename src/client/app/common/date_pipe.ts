import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    if (input === null) return '';
    var date: Date = new Date();
    date.setUTCFullYear(input[0], input[1] - 1, input[2]);
    return date.toDateString();
  }
}

@Pipe({
  name: 'localDateTime',
  pure: true
})
export class LocalDateTimePipe implements PipeTransform {

  transform(input: Array<number>): string {
    var date: Date = new Date();
    date.setUTCFullYear(input[0], input[1] - 1, input[2]);
    date.setUTCHours(input[3], input[4], input[5]);

    return date.toString();
  }
}

@Pipe({
  name: 'localShortDateTime',
  pure: true
})
export class LocalShortDateTimePipe implements PipeTransform {

  transform(input: Array<number>): string {
    var date: Date = new Date();
    date.setUTCFullYear(input[0], input[1] - 1, input[2]);
    date.setUTCHours(input[3], input[4], input[5]);

    return date.toLocaleString();
  }

}
