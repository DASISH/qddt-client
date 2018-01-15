import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorLogService } from './error-log.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private errorLogService: ErrorLogService) {
    super();
  }

  handleError(error) {
    this.errorLogService.logError(error);
  }
}
