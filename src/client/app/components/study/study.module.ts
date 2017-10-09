import { NgModule } from '@angular/core';
import { StudyComponent }   from '../study/study.component';
import { StudyEditComponent }   from '../study/edit/study.edit.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
    imports: [ SharedModule],
    declarations: [StudyComponent, StudyEditComponent],
    exports: [StudyComponent]
})

export class StudyModule { }
