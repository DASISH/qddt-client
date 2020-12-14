import { SurveyProgram } from '../classes';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { ActionKind, ElementKind } from '../enums';
import { IEntityEditAudit, IEntityAudit, ISurveyOrder } from '../interfaces';
import { getQueryInfo } from '../consts';
import { UserService } from './user.service';



@Injectable()
export class HomeService<T extends IEntityEditAudit>  {

  private readonly __canDo: Map<ElementKind, Map<ActionKind, boolean>>;
  constructor(private userService: UserService, protected http: HttpClient,
    @Inject(API_BASE_HREF) protected api: string) {

    this.__canDo = new Map<ElementKind, Map<ActionKind, boolean>>([
      [ElementKind.CONCEPT, new Map<ActionKind, boolean>([
        [ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.CONCEPT)],
        [ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.CONCEPT)],
        [ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.CONCEPT)]
      ])],
      [ElementKind.TOPIC_GROUP, new Map<ActionKind, boolean>([
        [ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.TOPIC_GROUP)],
        [ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.TOPIC_GROUP)],
        [ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.TOPIC_GROUP)]
      ])],
      [ElementKind.STUDY, new Map<ActionKind, boolean>([
        [ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.STUDY)],
        [ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.STUDY)],
        [ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.STUDY)]
      ])],
      [ElementKind.SURVEY_PROGRAM, new Map<ActionKind, boolean>([
        [ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.SURVEY_PROGRAM)],
        [ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.SURVEY_PROGRAM)],
        [ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.SURVEY_PROGRAM)]
      ])]
    ]);
  }


  canDo(kind: ElementKind): Map<ActionKind, boolean> {
    const qe = getQueryInfo(kind);
    return this.__canDo.get(qe.id);
  }

  async get(kind: ElementKind, id: string) {
    const qe = getQueryInfo(kind);
    return await this.http.get<T>(this.api + qe.path + '/' + id).toPromise();
  }

  async getExt<S extends IEntityAudit>(kind: ElementKind, id: string) {
    const qe = getQueryInfo(kind);
    return await this.http.get<S>(this.api + qe.path + '/' + id).toPromise();
  }

  getListByParent(kind: ElementKind, parentId?: string): Promise<T[]> {
    const qe = getQueryInfo(kind);
    return (parentId) ? this.http.get<T[]>(this.api + qe.path + '/list/by-parent/' + parentId).toPromise() :
      this.http.get<T[]>(this.api + qe.path + '/list').toPromise();
  }

  attachQuestion(kind: ElementKind, id: string, questionId: string, revision: number): Observable<T> {
    const qe = getQueryInfo(kind);
    if (revision === null) { revision = 0; }
    return this.http.post<T>(this.api + qe.path + '/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&parentId=' + id, {});
  }

  deattachQuestion(kind: ElementKind, id: string, questionId: string, revision: number): Observable<T> {
    const qe = getQueryInfo(kind);
    return this.http.post<T>(this.api + qe.path + '/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&parentId=' + id, {});
  }
  arrangeSurveys(surveys: ISurveyOrder[]): Observable<SurveyProgram[]> {
    console.log(surveys);
    return this.http.post<SurveyProgram[]>(this.api + 'surveyprogram/reorder/', { content: surveys });
    // throw new Error("Method not implemented.");
  }

}
