import {Component, Input} from '@angular/core';

@Component({
  selector: 'qddt-validation',
  template: `
    <div class="validation">
      <div *ngFor="let message of messages">{{message}}</div>
    </div>
  `,
  styles: [`
    .validation { color: yellow; margin: 26px;  }`
  ]
})
export class ValidationComponent {
  @Input() messages: Array<string>;
}
