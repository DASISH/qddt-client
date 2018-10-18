import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { InsertionDirective } from './insertion.directive';
import { ConfirmComponent } from './confirm/confirm.component';
import { NotifyComponent } from './notify/notify.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DialogComponent, InsertionDirective, ConfirmComponent, NotifyComponent],
  exports: [ConfirmComponent, NotifyComponent ],
  entryComponents: [DialogComponent]
})
export class DialogModule {}
