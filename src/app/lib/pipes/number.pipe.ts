import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'localNumber',
})
export class LocalNumberPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) protected localID: string) { }

  transform(value: any, format: string) {
    if (value == null) { return ''; } // !value would also react to zeros.
    if (!format) { format = '.2-2'; }

    return formatNumber(value, this.localID, format);
  }
}
