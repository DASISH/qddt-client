import { Component,  OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { QddtPropertyStoreService , HIERARCHY_POSITION } from '../../core/global/property.service';
import { HomeService } from '../home.service';
import { SurveyProgram } from '../home.classes';
import { TemplateService } from '../../template/template.service';
import { ActionKind, ElementKind } from '../../shared/classes/enums';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html'
})

export class SurveyComponent implements OnInit, AfterContentChecked {
  showSurveyForm = false;
  public surveyList: SurveyProgram[] = [];
  public survey: SurveyProgram;
  public readonly = false;
  refreshCount = 0;

  constructor(private surveyService: HomeService, private service: TemplateService,
                private router: Router, private property: QddtPropertyStoreService) {
    this.survey = new SurveyProgram();
    this.readonly = !service.can(ActionKind.Create, ElementKind.SURVEY_PROGRAM);
  }

  ngOnInit() {
    this.surveyList = this.property.get('surveyList');
    if (!this.surveyList) {
      this.surveyService.getAllSurvey()
        .then(
          (data: Array<SurveyProgram> ) =>
            this.property.set('surveyList', this.surveyList = data)
        );
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

  onRemoveSurvey(surveyId: any) {
    if (surveyId) {
      this.surveyService.deleteSurvey(surveyId)
        .subscribe(() => {
          this.surveyList = this.surveyList.filter((s: any) => s.id !== surveyId);
          this.property.set('surveyList', this.surveyList);
        });
    }
  }

  onSurveySaved(surveyProgram: any) {
    if (surveyProgram !== null) {
      const list = this.surveyList.filter((q) => q.id !== surveyProgram.id);
      list.push(surveyProgram);
      this.surveyList = list.sort( (a, b) => a.name > b.name ? -1 : 1);
      this.property.set('surveyList', this.surveyList);
    }
  }

  onShowStudy(surveyProgram: any) {
    this.property.set('survey', surveyProgram);
    this.property.setCurrent(HIERARCHY_POSITION.Survey, surveyProgram.name);
    this.router.navigate(['study']);
  }

  onSave() {
    this.surveyService.createSurvey(this.survey)
      .subscribe(
        (result: any) => this.onSurveySaved(result)
      );
    this.survey = new SurveyProgram();
    this.showSurveyForm = false;
  }


  getPdf(element: SurveyProgram) {
    const fileName = element.name + '.pdf';
    this.surveyService.getSurveyPdf(element.id)
    .then(
      (data: any) => filesaver.saveAs(data, fileName)
    );
  }
}
