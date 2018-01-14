import { ErrorHandler } from '@angular/core';

declare var Materialize: any;

export class ToastErrorHandler implements ErrorHandler {
  handleError(error) {
    Materialize.toast(error.message,4000);
  }
}
