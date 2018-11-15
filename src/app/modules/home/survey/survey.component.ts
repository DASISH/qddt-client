import { Component,  OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { SurveyProgram } from '../../../classes/home.classes';
import { PropertyStoreService} from '../../core/services';
import { HierarchyPosition} from '../../core/classes';
import {ActionKind, ElementKind} from '../../../classes';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-survey',

  templateUrl: './survey.component.html'
})

export class SurveyComponent implements OnInit, AfterContentChecked {
  showSurveyForm = false;
  public surveys: SurveyProgram[];
  public newSurvey: SurveyProgram;
  public readonly = false;
  refreshCount = 0;

  constructor(private homeService: HomeService, private router: Router, private property: PropertyStoreService) {
    this.newSurvey = new SurveyProgram();
    this.readonly = !homeService.canDo.get(ElementKind.SURVEY_PROGRAM).get(ActionKind.Create);
  }

  ngOnInit() {
      this.homeService.getSurveyByUser().then(
        (data: Array<SurveyProgram> ) => this.surveys = data
      );
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
      this.homeService.deleteSurvey(surveyId)
        .subscribe(() => {
          this.surveys = this.surveys.filter((s: any) => s.id !== surveyId);
          this.property.set('surveys', this.surveys);
        });
    }
  }

  onSurveySaved(surveyProgram: any) {
    if (surveyProgram) {

      const list = this.surveys.filter((q) => q.id !== surveyProgram.id);
      list.push(surveyProgram);
      this.surveys = list.sort( (a, b) => a.name.localeCompare(b.name));
      this.property.set('surveys', this.surveys);
    }
  }

  onShowStudy(surveyProgram: any) {
    this.property.set('survey', surveyProgram);
    this.property.setCurrentMenu(HierarchyPosition.Survey, { id: surveyProgram.id , name: surveyProgram.name });
    this.router.navigate(['study']);
  }

  onSave() {
    this.homeService.createSurvey(this.newSurvey)
      .subscribe( result => this.onSurveySaved(result) );
    this.newSurvey = new SurveyProgram();
    this.showSurveyForm = false;
  }


  getPdf(element: SurveyProgram) {
    const fileName = element.name + '.pdf';
    this.homeService.getPdf(element).then(
      data => { filesaver.saveAs(data, fileName);
      });
  }

  getXml(element: SurveyProgram) {
    const fileName = element.name + '.xml';
    this.homeService.getXml(element).then(
      data => { filesaver.saveAs(data, fileName); }
    );
  }
}
