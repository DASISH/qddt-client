import { Component,  OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { ActionKind, SurveyProgram, getQueryInfo} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { PropertyStoreService} from '../../core/services';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-survey',
  providers: [ {provide: 'elementKind', useValue: 'SURVEY_PROGRAM'}, ],
  templateUrl: './survey.component.html'
})

export class SurveyComponent implements OnInit, AfterContentChecked {
  showSurveyForm = false;
  public surveys: SurveyProgram[];
  public newSurvey: SurveyProgram;
  public readonly = false;
  refreshCount = 0;

  constructor(private homeService: HomeService<SurveyProgram>, private router: Router, private property: PropertyStoreService) {
    this.newSurvey = new SurveyProgram();
    homeService.qe = getQueryInfo('SURVEY_PROGRAM');
    this.readonly = !homeService.canDo.get(ActionKind.Create);
  }

  ngOnInit() {
      this.homeService.getListByParent().then(
        (result) => this.surveys = result );
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {}
    }
  }

  onSurveySaved(surveyProgram: any) {
    if (surveyProgram) {
      const list = this.surveys.filter((q) => q.id !== surveyProgram.id);
      if (surveyProgram.index) {
        list.splice(surveyProgram.index, 0, surveyProgram);
      } else {
        list.push(surveyProgram);
      }
      this.property.set('surveys', this.surveys = list);
    }
  }

  onShowStudy(surveyProgram: any) {
    this.property.set('survey', surveyProgram);
    this.property.setCurrentMenu(HierarchyPosition.Survey, { id: surveyProgram.id , name: surveyProgram.name });
    this.router.navigate(['study']);
  }

  onNewSave(survey) {
    console.log('saving');
    this.homeService.create(new SurveyProgram(survey)).subscribe(
      result => this.onSurveySaved(result) );
    this.showSurveyForm = false;
  }


  getPdf(element: SurveyProgram) {
    const fileName = element.name + '.pdf';
    this.homeService.getPdf(element).then(
      data => filesaver.saveAs(data, fileName));
  }

}
