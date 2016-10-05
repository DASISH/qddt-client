import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { ControlConstructComponent } from './controlconstruct.component';
import { ControlConstructDetailComponent } from './controlconstruct.detail.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule, ResponsedomainModule ],
  declarations: [ControlConstructComponent, ControlConstructDetailComponent
    ],
  exports: [ControlConstructComponent]
})

export class ControlConstructModule { }
