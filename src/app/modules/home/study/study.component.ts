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

  constructor(private router: Router,
    private property: PropertyStoreService,
    private message: MessageService,
    private homeService: HomeService<Study>,
    private route: ActivatedRoute,
    private templateService: TemplateService) {

    this.readonly = !homeService.canDo(this.STUDY).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.STUDY).get(ActionKind.Delete);
  }

  ngOnInit(): void {
    this.survey = this.property.get('survey');
    const parentId = this.route.snapshot.paramMap.get('id') || this.survey.id || this.property.menuPath[HierarchyPosition.Survey].id;
    this.loadStudies(parentId);
    // this.templateService.getByKindEntity<SurveyProgram>(ElementKind.SURVEY_PROGRAM, parentId)
    //   .then((result) => {
    //     this.property.set('studies', this.survey = result);
    //   });
  }

  private loadStudies(parentId: string) {
    // this.showProgressBar = true;
    this.homeService.getListByParent(this.STUDY, parentId)
      .then((result) => {
        this.property.set('studies', this.studies = result);
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
      this.templateService.delete(study)
        .subscribe(() => {
          this.survey._embedded.children = this.survey._embedded.children.filter((s: any) => s.id !== study.id);
          this.property.set('studies', this.survey._embedded.children);
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
