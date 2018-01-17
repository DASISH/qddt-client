import { Component,  OnInit } from '@angular/core';
import { SurveyService, SurveyProgram } from './survey.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
const saveAs = require('file-saver');

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html',
  providers: [SurveyService]
})
export class SurveyComponent implements OnInit {
  showSurveyForm = false;
  private surveys: any[]= [];
  private survey: any;

  constructor(private surveyService: SurveyService,private router: Router, private auth: AuthService) {
    this.survey = new SurveyProgram();
  }

  ngOnInit() {
    this.surveyService.getAll()
      .then(
        (data: Array<SurveyProgram> )=>this.surveys = data
      );
  }


  onSurveySaved(surveyProgram: any) {
    if (surveyProgram !== null) {
      this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
      this.surveys.push(surveyProgram);
      surveyProgram['isVisible'] = false;
    }
  }

  onShowStudy(surveyProgram: any) {
    this.auth.setGlobalObject('survey',surveyProgram);
    this.router.navigate(['./study',surveyProgram.id]);
    // this.show = false;
    // this.surveySelectEvent.emit(surveyProgram);
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
