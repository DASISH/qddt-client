import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevisionComponent } from './revision.component';
import { MaterializeModule } from 'angular2-materialize';
import { CompareModule } from '../compare/compare.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [CommonModule, MaterializeModule, CompareModule, SharedModule],
    declarations: [RevisionComponent],
    exports: [RevisionComponent]
})

export class RevisionModule { }
