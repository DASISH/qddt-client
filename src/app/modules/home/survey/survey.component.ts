import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  ActionKind,
  SurveyProgram,
  ElementKind,
  HomeService,
  TemplateService,
  UserService,
  HierarchyPosition,
  PropertyStoreService,
  delay,
  ISurveyOrder,
  SurveyOrder,
  fadeInAnimation,
  HalResource
} from 'src/app/lib';


@Component({
  selector: 'qddt-survey',
  styles: ['div .helper-text { color: white !important}'],
  templateUrl: './survey.component.html',
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class SurveyComponent implements OnInit {
  public surveys: HalResource<SurveyProgram>[];
  public showEditForm = false;
  public readonly = false;

  private readonly SURVEY = ElementKind.SURVEY_PROGRAM;

  constructor(private router: Router,
    private property: PropertyStoreService,
    private homeService: HomeService<SurveyProgram>,
    private templateService: TemplateService,
    private userService: UserService
  ) {
    this.readonly = !homeService.canDo(this.SURVEY).get(ActionKind.Create);
  }

  ngOnInit() {
    this.homeService.getListByParent(this.SURVEY).then(
      (result) => {

        this.surveys = result._embedded['surveyPrograms'];

      });
  }


  onSurveySaved(surveyProgram: SurveyProgram) {
    if (surveyProgram) {
      const index = this.surveys.findIndex(item => item.id === surveyProgram.id)
      const list = this.surveys;
      if (index >= 0) {
        list.splice(index, 1, surveyProgram);
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
    this.router.navigate(['study', surveyProgram.id]);
    // this.router.navigate(['study']);
  }

  onNewSave(survey) {
    this.templateService.create(new SurveyProgram(survey)
      .setLanguage(this.property.userSetting.xmlLang)).subscribe(
        result => this.onSurveySaved(result));
    this.showEditForm = false;
  }


  initComp() {
    delay(20).then(() => {
      document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
        input => M.CharacterCounter.init(input));
    });
  }

  async onHierarchyChanged(event) {
    if (event) {
      const orders = this.surveys.map<ISurveyOrder>((value, index) => new SurveyOrder({ uuid: value.id, index }))
      this.homeService.arrangeSurveys(orders).subscribe((result) => this.surveys = result);
    }
    // console.debug('moving event?');
  }


}
