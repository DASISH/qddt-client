import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

declare var Materialize: any;



@Injectable()
export class ErrorLogService {
  // private name: String = 'ErrorLogService';

  logError(error: any) {
    console.error('ERROR LOG -> ', error);

    if (error instanceof HttpErrorResponse) {
      if (error.error.exceptionMessage)
        Materialize.toast(error.error.exceptionMessage, 6000);
      else
        Materialize.toast(error.message, 6000);

    } else if (error instanceof TypeError) {

      console.error(error.stack);
      Materialize.toast((<TypeError>error).message, 4000);

    } else if (error instanceof Error) {

      if (error['rejection']) {
        this.logError(error['rejection']);
        return;
      }
        Materialize.toast(error, 4000);
      } else {

      console.error('Nobody threw an error but something happened!', error);
      Materialize.toast(error.message, 4000);

    }
  }
}
