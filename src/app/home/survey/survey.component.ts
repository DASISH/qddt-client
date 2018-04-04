import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElementKind } from '../../shared/elementinterfaces/elements';
import { PropertyStoreService , HIERARCHY_POSITION } from '../../core/global/property.service';
import { SurveyProgram, HomeService } from '../home.service';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  showSurveyForm = false;
  public surveys: SurveyProgram[] = [];
  private survey: SurveyProgram;
  private revision: any;
  private readonly revisionKind = ElementKind.SURVEY_PROGRAM;

  constructor(private surveyService: HomeService, private router: Router, private property: PropertyStoreService) {
    this.survey = new SurveyProgram();
  }

  ngOnInit() {
    this.surveys = this.property.get('surveys');
    if (!this.surveys) {
      this.surveyService.getAllSurvey()
        .then(
          (data: Array<SurveyProgram> ) =>
            this.property.set('surveys', this.surveys = data)
        );
    }
  }

  onRemoveSurvey(surveyId: any) {
    if (surveyId) {
      this.surveyService.deleteSurvey(surveyId)
        .subscribe(() => {
          this.surveys = this.surveys.filter((s: any) => s.id !== surveyId);
          this.property.set('surveys', this.surveys);
        });
    }
  }

  onSurveySaved(surveyProgram: any) {
    if (surveyProgram !== null) {
      this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
      this.surveys.push(surveyProgram);
      this.property.set('surveys', this.surveys);
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
