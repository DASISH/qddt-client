import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyStoreService , HIERARCHY_POSITION } from '../../core/global/property.service';
import { HomeService } from '../home.service';
import { SurveyProgram } from '../home.classes';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  showSurveyForm = false;
  public surveyList: SurveyProgram[] = [];
  public survey: SurveyProgram;

  constructor(private surveyService: HomeService, private router: Router, private property: PropertyStoreService) {
    this.survey = new SurveyProgram();
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
      this.surveyList = this.surveyList.filter((q) => q.id !== surveyProgram.id);
      this.surveyList.push(surveyProgram);
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
