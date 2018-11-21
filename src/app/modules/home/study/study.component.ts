import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { ActionKind, ElementKind, Study, SurveyProgram} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { PropertyStoreService} from '../../core/services';

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
  public newStudy: Study;
  public survey: SurveyProgram;
  public revision: any;
  refreshCount = 0;

  constructor(  private router: Router, private property: PropertyStoreService, private homeService: HomeService) {

    this.readonly = !homeService.canDo.get(ElementKind.STUDY).get(ActionKind.Create);
    this.canDelete = homeService.canDo.get(ElementKind.STUDY).get(ActionKind.Delete);
    this.newStudy = new Study();
  }

  ngOnInit(): void {
    const surveyProgram = this.property.get('survey');
    if (surveyProgram) {
      this.survey = surveyProgram;
    } else {
      const parentId = surveyProgram.id || this.property.menuPath[HierarchyPosition.Survey].id;
      this.homeService.getBySurveyStudy(parentId).then(result => this.survey = result);
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
  //
  // onShowRevision(element: any) {
  //   this.revision = element;
  // }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySaved(study: Study) {
    if (study) {
      const studies = this.survey.studies.filter((q) => q.id !== study.id);
      // const studies = this.survey.studies.find((q) => q.id !== study.id);
      studies.push(study);
      this.survey.studies = studies.sort( (a, b) => a.name.localeCompare(b.name));
    }
  }

  onSaveNewStudy() {
    this.showEditForm = false;
    this.homeService.create<Study>(this.newStudy, this.survey.id)
      .subscribe((result) => {
        this.onStudySaved(result);
    });
    this.newStudy  = new Study();
  }

  getPdf(study: Study) {
    const fileName = study.name + '.pdf';
    this.homeService.getPdf(study).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
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
      this.homeService.deleteStudy(studyId)
        .subscribe(() => {
          this.survey.studies = this.survey.studies.filter((s: any) => s.id !== studyId);
          this.property.set('studies', this.survey.studies);
        });
    }
  }
}
