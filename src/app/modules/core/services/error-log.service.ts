import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { throwError } from 'rxjs';

declare var Materialize: any;

@Injectable()
export class ErrorLogService {

  constructor(private authService: UserService) {}

  logError(error: any) {
    console.error('ERROR LOG -> ', error);

    if (error instanceof HttpErrorResponse) {

      this.handleError(error);

    } else if (error instanceof TypeError) {

      console.error(error.stack);
      Materialize.toast((<TypeError>error).message, 5000);

    } else if (error instanceof Error) {

      if (error['rejection']) {
        this.logError(error['rejection']);
        return;
      }
        Materialize.toast(error, 5000);
      } else {

      console.error('Nobody threw an error but something happened!', error);
      Materialize.toast(error.message, 5000);

    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      Materialize.toast(error.error.message, 5000);
    } else {
      if (error.status === 401) {
          this.authService.logout();
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.userfriendlyMessage) {
        Materialize.toast(`${error.error.userfriendlyMessage}`, 5000);
      } else {
        Materialize.toast(`Error code ${error.status}, <br> ${error.error.exceptionMessage}`, 5000);
      }
    }
    throwError('Something bad happened; please try again later.');
  }
}
