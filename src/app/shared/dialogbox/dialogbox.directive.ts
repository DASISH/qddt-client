import { Directive, Input, HostListener } from '@angular/core';
import { QddtModalService } from './dialogbox.service';

@Directive({
  selector: '[qddtModalOpen]'
})
export class QddtModalOpenDirective {
  @Input() modalOpenName: string;

  constructor(private qddtModals: QddtModalService) {
  }

  @HostListener('click') onClick() {
    const modal = this.qddtModals.get(this.modalOpenName);

    if (!modal) {
      console.error('No modal named %s', this.modalOpenName);
      return;
    }

    modal.toggle();
  }
}
