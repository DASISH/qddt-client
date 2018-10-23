import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { InsertionDirective } from './insertion.directive';
import { ConfirmComponent } from './content/confirm.component';
import { NotifyComponent } from './content/notify.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ DialogComponent, InsertionDirective, ConfirmComponent, NotifyComponent ],
  exports: [ ConfirmComponent, NotifyComponent ],
  entryComponents: [ DialogComponent ]
})
export class DialogModule {}
