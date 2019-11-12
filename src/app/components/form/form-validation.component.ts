import {Component, Input} from '@angular/core';


@Component({
  selector: 'qddt-validation',
  template: `
    <div class="container">
      <ul>
        <li *ngFor="let message of messages">{{message}}</li>
      </ul>
    </div>
  `
})
export class ValidationMessageComponent {
  @Input() messages: Array<string>;
}
