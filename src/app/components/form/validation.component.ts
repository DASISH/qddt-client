import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-validation',
  styles: ['.helper-text { display: inline; font-size: 0.7rem; color: red;}'],
  template: `<div class="helper-text" *ngFor="let message of messages">{{message}}</div>`
})
export class ValidationComponent {
  @Input() messages: Array<string>;
}
