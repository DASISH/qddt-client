import { AfterContentChecked, Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { HomeService} from '../home.service';
import { ActionKind, ElementKind, Study, SurveyProgram} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { PropertyStoreService} from '../../core/services';
import { TemplateService} from '../../../components/template';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-study',
  templateUrl: './study.component.html',
})

export class StudyComponent implements OnInit, AfterContentChecked {
  public showEditForm = false;
  public readonly: boolean;
  public canDelete: boolean;
  public survey: SurveyProgram;
  public revision: any;

  private refreshCount = 0;
  private readonly STUDY = ElementKind.STUDY;

  constructor(  private router: Router, private property: PropertyStoreService,
                private homeService: HomeService<Study>, private templateService: TemplateService ) {

    this.readonly = !homeService.canDo(this.STUDY).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.STUDY).get(ActionKind.Delete);
  }

  ngOnInit(): void {
    this.survey = this.property.get('survey');
    const parentId = this.survey.id || this.property.menuPath[HierarchyPosition.Survey].id;
    this.templateService.getByKindEntity<SurveyProgram>(ElementKind.SURVEY_PROGRAM, parentId)
    .then((result) => {
      this.property.set('survey', this.survey = result);
    });
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {}
    }
  }

  onShowTopic(study: Study) {
    const prevStudy = this.property.get('study');
    if (!prevStudy || prevStudy.id !== study.id) {
      this.property.set('topics', null);
    }

    this.property.set('study', study);
    this.property.setCurrentMenu(HierarchyPosition.Study, { id: study.id, name:  study.name });
    this.router.navigate(['topic']);
  }


  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySaved(study: Study) {
    if (study !== null) {
      const index = this.survey.studies.findIndex((f) => f.id === study.id);
      if (index > -1) {
        this.survey.studies.splice(index, 1, study);
      } else {
        this.survey.studies.push(study);
      }
    }
  }

  onNewSave(study) {
    this.showEditForm = false;
    this.templateService.create(new Study(study), this.survey.id).subscribe(
      result => this.onStudySaved(result) );
  }

  getPdf(study: Study) {
    const fileName = study.name + '.pdf';
    this.templateService.getPdf(study).then(
      (data) => filesaver.saveAs(data, fileName) );
  }


  onRemoveStudy(studyId: string) {
    if (studyId) {
      this.templateService.delete(new Study({id: studyId}))
        .subscribe(() => {
          this.survey.studies = this.survey.studies.filter((s: any) => s.id !== studyId);
          this.property.set('studies', this.survey.studies);
        });
    }
  }
}
