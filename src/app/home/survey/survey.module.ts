import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PreviewModule } from '../../preview/preview.module';
import { SurveyComponent } from './survey.component';
import { SurveyEditComponent } from './survey.edit.component';
import { SurveyService } from './survey.service';


@NgModule({
    imports: [SharedModule, PreviewModule ],
    declarations: [SurveyComponent, SurveyEditComponent],
    exports: [SurveyComponent],
    providers: [SurveyService]
})

export class SurveyModule { }
