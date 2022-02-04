import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { UserService } from './user.service';
import { toast } from 'materialize-css';



@Injectable()
export class ErrorLogService {

  constructor(private authService: UserService) { }

  logError(error: any) {
    console.error('ERROR LOG -> ', error);

    if (error instanceof HttpErrorResponse) {

      this.handleError(error);

    } else if (error instanceof TypeError) {

      console.error(error.stack);
      toast({ html: '<em style="color:yellow">' + (error as TypeError).message + '</em>', displayLength: 5000 });

    } else if (error instanceof Error) {

      // @ts-ignore
      if (error.rejection) {
        // @ts-ignore
        this.logError(error.rejection);
        return;
      }
      toast({ html: error.message, displayLength: 5000 });
    } else {

      console.error('Nobody threw an error but something happened!', error);
      toast({ html: error.message, displayLength: 5000 });

    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      toast({ html: error.error.message });
    } else {
      if (error.status === 401) {
        this.authService.logout();
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.userfriendlyMessage) {
        toast({
          html: error.error.userfriendlyMessage,
          displayLength: 5000
        });
      } else {
        toast({
          html: `Error code ${error.status}, <br> ${error.error.exceptionMessage}`,
          displayLength: 5000
        });
      }
    }
    throwError('Something bad happened; please try again later.');
  }
}
