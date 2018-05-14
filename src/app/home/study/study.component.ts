import {  Component, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HIERARCHY_POSITION, QddtPropertyStoreService } from '../../core/global/property.service';
import { Study, SurveyProgram } from '../home.classes';
import { HomeService } from '../home.service';
import { TemplateService } from '../../template/template.service';
import { ActionKind, ElementKind } from '../../shared/classes/enums';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
})

export class StudyComponent implements OnInit, AfterContentChecked {
  public showEditForm = false;
  public readonly: boolean;
  public canDelete: boolean;
  public study: any;
  public survey: SurveyProgram;
  public revision: any;
  refreshCount = 0;

  constructor(  private router: Router, private route: ActivatedRoute, private property: QddtPropertyStoreService,
                private studyService: HomeService, private service: TemplateService) {
    this.readonly = !service.can(ActionKind.Create, ElementKind.STUDY );
    this.canDelete = service.can(ActionKind.Delete, ElementKind.STUDY );
    this.study = new Study();
  }

  ngOnInit(): void {
    const survey = this.property.get('survey');
    if (survey) {
      this.survey = survey;
    } else {
        this.studyService.getAllStudy(this.survey.id).then(result => this.survey.studies = result);
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

  onShowTopic(study: any) {
    const prevStudy = this.property.get('study');
    if (!prevStudy || prevStudy.id !== study.id) {
      this.property.set('topics', null);
    }
    this.property.set('study', study);
    this.property.setCurrent(HIERARCHY_POSITION.Study, study.name);
    this.router.navigate(['topic']);
  }

  onShowRevision(element: any) {
    this.revision = element;
  }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySaved(study: any) {
    if (study !== null) {
      const studies = this.survey.studies.filter((q) => q.id !== study.id);
      studies.push(study);
      this.survey.studies = studies.sort( (a, b) => a.name > b.name ? -1 : 1);
    }
  }

  onSaveNewStudy() {
    this.showEditForm = false;
    this.studyService.createStudy(this.study, this.survey.id)
      .subscribe((result: any) => {
        this.onStudySaved(result);
    });
    this.study  = new Study();
  }

  getPdf(element: Study) {
    const fileName = element.name + '.pdf';
    this.studyService.getStudyPdf(element.id).then(
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
