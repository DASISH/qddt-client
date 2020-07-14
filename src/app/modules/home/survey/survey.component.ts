import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  SurveyProgram,
  ElementKind,
  HomeService,
  TemplateService,
  HierarchyPosition,
  PropertyStoreService
} from '../../../lib';


@Component({
  selector: 'qddt-survey',
  styles: ['div .helper-text { color: white !important}'],
  templateUrl: './survey.component.html',
})

export class SurveyComponent implements OnInit {
  public surveys: SurveyProgram[];
  public showSurveyForm = false;
  public readonly = false;

  private notInit = true;
  private readonly SURVEY = ElementKind.SURVEY_PROGRAM;

  constructor(private router: Router,
    private property: PropertyStoreService,
    private homeService: HomeService<SurveyProgram>,
    private templateService: TemplateService,
  ) {
    this.readonly = !homeService.canDo(this.SURVEY).get(ActionKind.Create);
  }

  ngOnInit() {
    this.homeService.getListByParent(this.SURVEY).then(
      (result) => this.surveys = result);
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
    this.property.setCurrentMenu(HierarchyPosition.Survey, { id: surveyProgram.id, name: surveyProgram.name });
    this.property.pathClear(HierarchyPosition.Study);
    this.property.pathClear(HierarchyPosition.Topic);
    this.property.pathClear(HierarchyPosition.Concept);
    this.router.navigate(['study']);
    // this.property.set('topic', null);
    // this.property.set('study', null);
    // this.property.set('concept', null);
  }

  onNewSave(survey) {
    this.templateService.create(new SurveyProgram(survey)).subscribe(
      result => this.onSurveySaved(result));
    this.showSurveyForm = false;
  }

  private readonly delay = () => new Promise(resolve => setTimeout(resolve, 50));

  initComp() {
    if (this.notInit) {
      this.notInit = false;
      this.delay().then(data => {
        document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
          input => M.CharacterCounter.init(input));
      });
    }
  }


}
