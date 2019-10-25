import { Component,  OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ActionKind, SurveyProgram, ElementKind, HomeService, TemplateService, HierarchyPosition, PropertyStoreService} from '../../../lib';
import * as FileSaver from 'file-saver';




@Component({
  selector: 'qddt-survey',
  templateUrl: './survey.component.html'
})

export class SurveyComponent implements OnInit, AfterContentChecked {
  public surveys: SurveyProgram[];
  public showSurveyForm = false;
  public readonly = false;

  private refreshCount = 0;
  private readonly SURVEY = ElementKind.SURVEY_PROGRAM;

  constructor(private router: Router,
              private property: PropertyStoreService,
              private homeService: HomeService<SurveyProgram>,
              private templateService: TemplateService,
             // private modalService: ModalService
  ) {
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
        M.updateTextFields();
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
    console.log('onshow survey');
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
      data => FileSaver.saveAs(data, fileName));
  }

}
