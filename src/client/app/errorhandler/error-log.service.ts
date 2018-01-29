import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

declare var Materialize: any;



@Injectable()
export class ErrorLogService {
  // private name: String = 'ErrorLogService';

  logError(error: any) {
    if (error instanceof HttpErrorResponse) {

      console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
      if (error.error.exceptionMessage)
        Materialize.toast(error.error.exceptionMessage,6000);
      else
        Materialize.toast(error.message,6000);

    } else if (error instanceof TypeError) {

      console.error('There was a Type error.', error.message);
      console.error(error.stack);
      Materialize.toast((<TypeError>error).message,4000);

    } else if (error instanceof Error) {
      if (error['rejection'].error.exceptionMessage)
        Materialize.toast(error['rejection'].error.exceptionMessage ,4000);
      else if (error['rejection'].error.error.message)
        Materialize.toast(error['rejection'].error.error.message ,4000);
	  else
        Materialize.toast(error.message ,4000);
      console.error('There was a general error.', error);

    } else {

      console.error('Nobody threw an error but something happened!', error);
      Materialize.toast(error.message,4000);

    }
  }
}
