import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { ActionKind, ElementKind, Study, SurveyProgram, getQueryInfo} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { PropertyStoreService} from '../../core/services';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-study',
  providers: [ {provide: 'elementKind', useValue: 'STUDY'}, ],
  templateUrl: './study.component.html',
})

export class StudyComponent implements OnInit, AfterContentChecked {
  public showEditForm = false;
  public readonly: boolean;
  public canDelete: boolean;
  public survey: SurveyProgram;
  public revision: any;
  refreshCount = 0;

  constructor(  private router: Router, private property: PropertyStoreService, private homeService: HomeService<Study>) {

    homeService.qe = getQueryInfo('STUDY');
    this.readonly = !homeService.canDo.get(ActionKind.Create);
    this.canDelete = homeService.canDo.get(ActionKind.Delete);
  }

  ngOnInit(): void {
    const surveyProgram = this.property.get('survey');
    if (surveyProgram) {
      this.survey = surveyProgram;
    } else {
      const parentId = this.property.menuPath[HierarchyPosition.Survey].id;
      this.homeService.getListByParent(parentId).then(result => this.survey.studies = result);
    }
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
    this.homeService.create(new Study(study), this.survey.id).subscribe(
      result => this.onStudySaved(result) );
  }

  getPdf(study: Study) {
    const fileName = study.name + '.pdf';
    this.homeService.getPdf(study).then(
      (data) => filesaver.saveAs(data, fileName) );
  }

  // getXml(study: Study) {
  //   const fileName = study.name + '.xml';
  //   this.homeService.getXml(study).then(
  //     (data: any) => {
  //       filesaver.saveAs(data, fileName);
  //     });
  // }

  onRemoveStudy(studyId: string) {
    if (studyId) {
      this.homeService.delete(studyId)
        .subscribe(() => {
          this.survey.studies = this.survey.studies.filter((s: any) => s.id !== studyId);
          this.property.set('studies', this.survey.studies);
        });
    }
  }
}
