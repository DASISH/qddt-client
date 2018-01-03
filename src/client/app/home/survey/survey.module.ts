import { NgModule } from '@angular/core';
import { SurveyComponent }   from './survey.component';
import { SurveyEditComponent }   from './survey.edit.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    imports: [SharedModule ],
    declarations: [SurveyComponent, SurveyEditComponent],
    exports: [SurveyComponent]
})

export class SurveyModule { }
