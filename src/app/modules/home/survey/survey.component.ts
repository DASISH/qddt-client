import { Component,  OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { ActionKind, SurveyProgram, ElementKind} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { PropertyStoreService} from '../../core/services';
import { TemplateService} from '../../../components/template';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-survey',
  templateUrl: './survey.component.html'
})

export class SurveyComponent implements OnInit, AfterContentChecked {
  public surveys: SurveyProgram[];
  public newSurvey: SurveyProgram;
  public showSurveyForm = false;
  public readonly = false;

  private refreshCount = 0;
  private readonly SURVEY = ElementKind.SURVEY_PROGRAM;

  constructor(private router: Router, private property: PropertyStoreService,
              private homeService: HomeService<SurveyProgram>, private  templateService: TemplateService) {
    this.newSurvey = new SurveyProgram();
    this.readonly = !homeService.canDo(this.SURVEY).get(ActionKind.Create);
  }

  ngOnInit() {
      this.homeService.getListByParent(this.SURVEY).then(
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
    this.templateService.create(new SurveyProgram(survey)).subscribe(
      result => this.onSurveySaved(result) );
    this.showSurveyForm = false;
  }


  getPdf(element: SurveyProgram) {
    const fileName = element.name + '.pdf';
    this.templateService.getPdf(element).then(
      data => filesaver.saveAs(data, fileName));
  }

}
