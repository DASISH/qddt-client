import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ActionKind, delay,
  ElementKind,
  fadeInAnimation,
  HierarchyPosition,
  HomeService,
  Instrument,
  LANGUAGE_MAP, MessageService, PropertyStoreService,
  Study,
  SurveyProgram, TemplateService
} from '../../../lib';


@Component({
  selector: 'qddt-study',
  styles: ['qddt-select > div.select-wrapper  > input.select-dropdown  { color:white}'],
  templateUrl: './study.component.html',
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class StudyComponent implements OnInit {
  public showEditForm = false;
  public readonly: boolean;
  public canDelete: boolean;
  public survey: SurveyProgram;
  public studies: Study[];
  public revision: any;

  private readonly STUDY = ElementKind.STUDY;
  public readonly LANGUAGES = LANGUAGE_MAP;
  private getId = (href: string): string => href.split('/').pop();

   constructor(private router: Router,
    private property: PropertyStoreService,
    private message: MessageService,
    private homeService: HomeService<Study>,
    private templateService: TemplateService) {

    this.readonly = !homeService.canDo(this.STUDY).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.STUDY).get(ActionKind.Delete);
  }

  ngOnInit(): void {
    this.survey = this.property.get('survey');
    const parentId = this.survey.id || this.property.menuPath[HierarchyPosition.Survey].id;
    this.loadStudies(parentId);
  }

  private loadStudies(parentId: string) {
    this.studies = []
    this.homeService.getListByParent(this.STUDY,parentId)
    .then((result) => {
      result.forEach(async (survey, index) => {
        await this.templateService
          .getByKindEntity<Study>(this.STUDY, this.getId(survey._links?.self.href))
          .then((item) => result[index] = item);
      });
      console.log(result)
      this.studies = result
      this.property.set('studies', this.studies)
    });
  }

  onShowTopic(study: Study) {
    const prevStudy = this.property.get('study');
    if (!prevStudy || prevStudy.id !== study.id) {
      this.property.set('topics', null);
    }

    this.property.set('study', study);
    this.property.setCurrentMenu(HierarchyPosition.Study, { id: study.id, name: study.name });
    this.router.navigate(['topic', study.id]);
    // this.router.navigate(['topic']);
  }

  public onShowElement(element: Instrument) {
    this.message.sendMessage({ element, elementKind: element.classKind });
  }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySaved(study: Study) {
    if (study !== null) {
      this.survey._embedded.children = this.survey._embedded.children || [];

      const index = this.survey._embedded.children.findIndex((f) => f.id === study.id);
      if (index > -1) {
        this.survey._embedded.children.splice(index, 1, study);
      } else {
        this.survey._embedded.children.push(study);
      }
    }
  }

  onNewSave(study) {
    this.showEditForm = false;
    this.templateService.create<Study>(new Study(study)
      .setLanguage(this.property.userSetting.xmlLang), this.survey.id).subscribe(
        result => this.onStudySaved(result));
  }


  onRemoveStudy(study: Study) {
    if (study) {
      console.log(this.survey.id);

      this.templateService.delete(study)
        .subscribe(() => {

          this.studies = this.studies
            .filter((s: any) => s.id !== study.id)
            .map((s:Study,index) => {
              s.parentIdx = index
              return s
            })
          this.property.set('studies', this.studies);
        });
    }
  }

  onHierarchyChanged(event) {
    // console.debug('moving event?');
    this.survey.changeKind = 'UPDATED_HIERARCHY_RELATION';
    this.survey.changeComment = 'Study order changed';
    this.templateService.update<SurveyProgram>(this.survey).subscribe((result) => {
      this.property.set('survey', this.survey = result);
    });
  }


  initComp() {
    delay(20).then(() => {
      document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
        input => M.CharacterCounter.init(input));
    });
  }

}
