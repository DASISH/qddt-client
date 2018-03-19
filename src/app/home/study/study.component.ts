import {  Component, OnInit } from '@angular/core';
import { StudyService, Study } from './study.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyProgram } from '../survey/survey.service';
import { HIERARCHY_POSITION, PropertyStoreService } from '../../core/global/property.service';
import { ElementKind } from '../../preview/preview.service';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
})
export class StudyComponent implements OnInit {
  showEditForm = false;

  public readonly revisionKind = ElementKind.STUDY;

  public study: any;
  public survey: SurveyProgram;
  public revision: any;

  constructor(  private router: Router, private route: ActivatedRoute,
                private studyService: StudyService, private property: PropertyStoreService) {
    this.study = new Study();
  }

  ngOnInit(): void {
    const survey = this.property.get('survey');
    if (survey) {
      this.survey = survey;
    } else {
        this.studyService.getAll(this.survey.id).then(result => this.survey.studies = result);
    }
  }

  onShowTopic(study: any) {
    const prevStudy = this.property.get('study');
    if (!prevStudy || prevStudy.id !== study.id) {
      this.property.set('topics', null);
    }
    this.property.set('study', study);
    this.property.setCurrent(HIERARCHY_POSITION.Study, study.name);
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
      const studies = this.survey.studies.filter((q) => q.id !== study.id);
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
        filesaver.saveAs(data, fileName);
      });
  }

  onRemoveStudy(studyId: string) {
    if (studyId) {
      this.studyService.deleteStudy(studyId)
        .subscribe(() => {
          this.survey.studies = this.survey.studies.filter((s: any) => s.id !== studyId);
          this.property.set('studies', this.survey.studies);
        });
    }
  }
}
