import {  Component, OnInit } from '@angular/core';
import { StudyService, Study } from './study.service';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { SurveyProgram } from '../survey/survey.service';
import { HIERARCHY_POSITION, PropertyStoreService } from '../../core/global/property.service';
import { ElementKind } from '../../preview/preview.service';

const saveAs = require('file-saver');

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
})
export class StudyComponent implements OnInit {
  showEditForm = false;

  private readonly revisionKind = ElementKind.STUDY;

  private study: any;
  private survey: SurveyProgram;
  private revision: any;

  constructor(  private router: Router, private route: ActivatedRoute,
                private studyService: StudyService, private property: PropertyStoreService) {
    this.study = new Study();
  }

  ngOnInit(): void {
    let survey= this.property.get('survey');
    if (survey) {
      this.survey = survey;
    } else {
        this.studyService.getAll(this.survey.id).then(result=> this.survey.studies = result);
    }
  }

  onShowTopic(study: any) {
    this.property.set('study',study);
    this.property.setCurrent(HIERARCHY_POSITION.Study,study.name);
    this.router.navigate(['topic']);
  }

  onShowRevision(element: any) {
    this.revision = element;
  }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySavedEvent(study: any) {
    if (study !== null) {
      let studies = this.survey.studies.filter((q) => q.id !== study.id);
      studies.push(study);
      this.survey.studies = studies;
    }
  }

  onSaveNewStudy() {
    this.showEditForm = false;
    this.studyService.save(this.study, this.survey.id)
      .subscribe((result: any) => {
        this.onStudySavedEvent(result);
    });
    this.study  = new Study();
  }

  getPdf(element: Study) {
    const fileName = element.name + '.pdf';
    this.studyService.getPdf(element.id).then(
      (data: any) => {
        saveAs(data, fileName);
      });
  }

  onRemoveStudy(studyId: string) {
    if (studyId && studyId.length === 36) {
      let studies = this.survey.studies;
      this.studyService.deleteStudy(studyId)
        .subscribe(() =>
          this.survey.studies = studies.filter(q => q['id'] === studyId));
    }
  }
}
