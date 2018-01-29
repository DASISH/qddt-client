import { NgModule } from '@angular/core';
import { StudyComponent } from './study.component';
import { StudyEditComponent } from './study.edit.component';
import { SharedModule } from '../../shared/shared.module';
import { PreviewModule } from '../../preview/preview.module';
import { StudyService } from './study.service';


@NgModule({
    imports: [SharedModule, PreviewModule],
    declarations: [StudyComponent, StudyEditComponent],
    exports: [StudyComponent],
    providers: [StudyService]
})

export class StudyModule { }
