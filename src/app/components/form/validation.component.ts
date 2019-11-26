import {Component, Input} from '@angular/core';

@Component({
  selector: 'qddt-validation',
  template: `
    <div class="validation">
      <div *ngFor="let message of messages">{{message}}</div>
    </div>
  `,
  styles: [`
    .validation { color: red; margin: 6px;  }`
  ]
})
export class ValidationComponent {
  @Input() messages: Array<string>;
}
