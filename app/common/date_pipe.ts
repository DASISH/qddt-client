import {Component, Pipe} from 'angular2/angular2';

@Pipe({
  name: 'localDateTime',
  pure: true
})
export class LocalDateTimePipe {

  transform(input: Array<number>): string {

    var date: Date = new Date();
    date.setFullYear(input[0]);
    date.setMonth(input[1]);
    date.setDate(input[2]);
    date.setHours(input[3]);
    date.setMinutes(input[4]);
    date.setSeconds(input[5]);
    date.setMilliseconds(input[6]);

    return date.toString();
  }
}
