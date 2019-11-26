import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffComponent } from './diff.component';

@NgModule({
    imports: [CommonModule ],
    declarations: [DiffComponent],
    exports: [DiffComponent]
})

export class CompareModule { }
