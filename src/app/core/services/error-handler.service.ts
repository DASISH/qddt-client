import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorLogService } from './error-log.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  private  lastHandled: Date;
  private  lastError: any;

  constructor(private errorLogService: ErrorLogService) {
    super();
  }

  handleError(error: any) {
    if (this.lastError === error.message) {
      if ((new Date().valueOf() - this.lastHandled.valueOf()) < 5000) {
        console.log(error.message);
        this.lastHandled =  new Date();
        return;
      }
      console.log('same error longtime...');
    }
    this.lastError = error.message;
    this.lastHandled =  new Date();
    this.errorLogService.logError(error);
  }
}
