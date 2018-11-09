import {  Component, OnInit, AfterContentChecked } from '@angular/core';
import {  Router } from '@angular/router';
import { HomeService } from '../home.service';
import { TemplateService } from '../../template/template.service';
import { Study, SurveyProgram } from '../home.classes';
import { ActionKind, ElementKind } from '../../shared/classes';
import {PropertyStoreService} from '../../core/services';
import {HierarchyPosition} from '../../core/classes';

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

  constructor(  private router: Router, private property: PropertyStoreService,
                private studyService: HomeService, private service: TemplateService) {

    this.readonly = !service.can(ActionKind.Create, ElementKind.STUDY );
    this.canDelete = service.can(ActionKind.Delete, ElementKind.STUDY );
    this.newStudy = new Study();
  }

  ngOnInit(): void {
    const surveyProgram = this.property.get('survey');
    if (surveyProgram) {
      this.survey = surveyProgram;
    } else {
      const parentId = surveyProgram.id || this.property.menuPath[HierarchyPosition.Survey].id;
      this.studyService.getStudyBySurvey(parentId).then(result => this.survey = result);
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

  onStudySaved(study: any) {
    if (study) {
      const studies = this.survey.studies.filter((q) => q.id !== study.id);
      studies.push(study);
      this.survey.studies = studies.sort( (a, b) => a.name.localeCompare(b.name));
    }
  }

  onSaveNewStudy() {
    this.showEditForm = false;
    this.studyService.createStudy(this.newStudy, this.survey.id)
      .subscribe((result: any) => {
        this.onStudySaved(result);
    });
    this.newStudy  = new Study();
  }

  getPdf(element: Study) {
    const fileName = element.name + '.pdf';
    this.studyService.getPdf(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(element: Study) {
    const fileName = element.name + '.xml';
    this.studyService.getXml(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  onRemoveStudy(studyId: string) {
    if (studyId) {
      this.studyService.deleteStudy(studyId)
        .subscribe(() => {
          this.survey.studies = this.survey.studies.filter((s: any) => s.id !== studyId);
          this.property.set('studies', this.survey.studies);
        });
    }
  }
}
