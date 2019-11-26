import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import localeGb from '@angular/common/locales/en-GB';
import localeGbExtra from '@angular/common/locales/extra/en-GB';
import localeNo from '@angular/common/locales/nb';
import localeNoExtra from '@angular/common/locales/extra/nb';


@Injectable({ providedIn: 'root' })
export class SessionService {
  private _locale: string;
  private _initLocals = [];

  constructor() {
    this.locale = navigator.language || navigator.languages[0];
  }

  set locale(value: string) {
    this._locale = value;

    if (this._initLocals.findIndex(search => search === value) < 0) {
      switch (value) {
        case 'no':
        case 'nb-NO':
          registerLocaleData(localeNo, value, localeNoExtra);
          break;
        case 'en':
        case 'en-GB':
          registerLocaleData(localeGb, value , localeGbExtra);
          break;
        default: break;
      }
      this._initLocals.push(value);
    }
    // tslint:disable-next-line:no-console
    console.info(value);
  }

  get locale(): string {
    return this._locale;
  }

}
