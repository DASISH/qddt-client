import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public revision: any;

  public readonly LANGUAGES = LANGUAGE_MAP;

  private parentId: string;
  private readonly STUDY = ElementKind.STUDY;

  private getId = (href: string): string => href.split('/').pop().split('{')[0];
  private getStudy = (href: string) => this.templateService.getByKindEntity<Study>(this.STUDY, this.getId(href));
  public get studies(): Study[] {
    return this.property.get('studies')
  }
  private set studies(values: Study[]) {
    this.property.set('studies', values)
  }


  constructor(private router: Router, private property: PropertyStoreService, private message: MessageService,
    private homeService: HomeService<Study>, private templateService: TemplateService) {

    this.readonly = !homeService.canDo(this.STUDY).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.STUDY).get(ActionKind.Delete);

  }

  ngOnInit(): void {
    this.survey = this.property.get('survey');
    this.parentId = this.survey.id || this.property.menuPath[HierarchyPosition.Survey].id;
    this.loadStudies(this.parentId);
  }

  private async loadStudies(parentId: string) {

    if (this.survey && this.survey._embedded?.children) {
      let tmp: Study[] = []
      this.survey._embedded.children.forEach(async (study) => {
        tmp.push(await this.getStudy(study._links?.self.href))
      });
      this.studies = tmp;

    } else {
      this.homeService.getListByParent(this.STUDY, parentId)
        .then((result) => {
          result.forEach(async (study, index) => result[index] = await this.getStudy(study._links?.self.href));
          this.studies = result;
        });
    }
    console.debug(this.studies)
  }

  onShowTopic(study: Study) {
    const prevStudy = this.property.get('study');
    if (!prevStudy || prevStudy.id !== study.id) {
      this.property.set('topics', null);
    }

    this.property.set('study', study);
    this.property.setCurrentMenu(HierarchyPosition.Study, { id: study.id, name: study.label });
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
      let oldItems = this.studies

      const index = oldItems.findIndex((f) => f.id === study.id);
      if (index > -1) {
        oldItems.splice(index, 1, study);
      } else {
        oldItems.push(study);
      }
      this.studies = oldItems
    }
  }

  onNewSave(study) {
    this.showEditForm = false;
    this.templateService.create<Study>(new Study(study)
      .setLanguage(this.property.userSetting.xmlLang), this.parentId).subscribe(
        result => this.onStudySaved(result));
  }


  onRemoveStudy(study: Study) {
    if (study) {
      this.templateService.delete(study)
        .subscribe(() => {

          this.studies = this.studies
            .filter((s: any) => s.id !== study.id)
            .map((s: Study, index) => {
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
