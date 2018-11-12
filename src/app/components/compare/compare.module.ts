import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffComponent } from './diff.component';
import { MaterializeModule } from 'angular2-materialize';

@NgModule({
    imports: [CommonModule, MaterializeModule],
    declarations: [DiffComponent],
    exports: [DiffComponent]
})

export class CompareModule { }
