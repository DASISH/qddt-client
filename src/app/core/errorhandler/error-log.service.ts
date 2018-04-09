import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

declare var Materialize: any;

@Injectable()
export class ErrorLogService {
  // private name: String = 'ErrorLogService';

  logError(error: any) {
    console.error('ERROR LOG -> ', error);

    if (error instanceof HttpErrorResponse) {

      this.handleError(error);

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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      Materialize.toast(error.error.message, 6000);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.userfriendlyMessage) {
        Materialize.toast(`${error.error.userfriendlyMessage}`, 6000);
      } else {
        Materialize.toast(`Error code ${error.status}, <br> ${error.error.exceptionMessage}`, 6000);
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  }
}
