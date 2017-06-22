import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { ElementFooterComponent } from './elementfooter.component';

@NgModule({
  imports: [CommonModule, MaterializeModule],
  declarations: [ElementFooterComponent],
  exports: [ElementFooterComponent]
})

export class RevisionComponent { }
