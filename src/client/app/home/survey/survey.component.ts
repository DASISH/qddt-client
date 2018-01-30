import { Component,  OnInit } from '@angular/core';
import { SurveyService, SurveyProgram } from './survey.service';
import { Router } from '@angular/router';
import { ElementKind } from '../../preview/preview.service';
import { PropertyStoreService ,HIERARCHY_POSITION } from '../../core/global/property.service';

const saveAs = require('file-saver');

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  showSurveyForm = false;
  private surveys: any[]= [];
  private survey: any;
  private revision: any;
  private readonly revisionKind = ElementKind.SURVEY;

  constructor(private surveyService: SurveyService,private router: Router, private property: PropertyStoreService) {
    this.survey = new SurveyProgram();
  }

  ngOnInit() {
    this.surveys = this.property.get('surveys');
    if(!this.surveys)
      this.surveyService.getAll()
        .then(
          (data: Array<SurveyProgram> )=>this.surveys = data
        );
  }


  onSurveySaved(surveyProgram: any) {
    if (surveyProgram !== null) {
      this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
      this.surveys.push(surveyProgram);
      // surveyProgram['isVisible'] = false;
    }
  }

  onShowStudy(surveyProgram: any) {
    this.property.set('survey',surveyProgram);
    this.property.setCurrent(HIERARCHY_POSITION.Survey, surveyProgram.name);
    this.router.navigate(['study']);
  }

  onShowRevision(element: any) {
    this.revision = element;
  }

  onSave() {
    this.surveyService.create(this.survey)
      .subscribe(
        (result: any) => this.onSurveySaved(result)
      );
    this.survey = new SurveyProgram();
    this.showSurveyForm = false;
  }

  getPdf(element: SurveyProgram) {
    const fileName = element.name + '.pdf';
    this.surveyService.getPdf(element.id)
    .then(
      (data: any) => saveAs(data, fileName)
    );
  }
}
