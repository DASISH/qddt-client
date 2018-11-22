import {Inject, Injectable, Optional} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { UserService} from '../core/services';
import { API_BASE_HREF} from '../../api';
import {
  ActionKind,
  ElementKind,
  getQueryInfo, HEADER_DETAILS, IEntityAudit,
  IEntityEditAudit,
  IOtherMaterial,
  IPageResult, IRevisionResult, QueryInfo
} from '../../classes';
import {filter, takeWhile} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Factory, Generic} from '../../classes/factory';


@Injectable()
export class HomeService<T extends IEntityEditAudit> {

  public readonly canDo: Map<ActionKind, boolean>;

  private qe: QueryInfo;

  constructor( private userService: UserService, protected http: HttpClient,
               @Inject(API_BASE_HREF) protected api: string, @Inject('elementKind')private kind: string) {
    this.qe = getQueryInfo(kind);
    this.canDo = new Map<ActionKind, boolean>([
      [ ActionKind.Create, userService.canDo(ActionKind.Create, this.qe.id) ],
      [ ActionKind.Update, userService.canDo(ActionKind.Update, this.qe.id) ],
      [ ActionKind.Delete, userService.canDo(ActionKind.Delete, this.qe.id) ]
    ]);

    // this.canDoToo = new Map<ElementKind, Map<ActionKind, boolean>>([
    //   [ElementKind.CONCEPT, new Map<ActionKind, boolean>([
    //     [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.CONCEPT) ],
    //     [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.CONCEPT) ],
    //     [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.CONCEPT) ]
    //   ])],
    //   [ElementKind.TOPIC_GROUP, new Map<ActionKind, boolean>([
    //     [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.TOPIC_GROUP) ],
    //     [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.TOPIC_GROUP) ],
    //     [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.TOPIC_GROUP) ]
    //   ])],
    //   [ElementKind.STUDY, new Map<ActionKind, boolean>([
    //     [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.STUDY) ],
    //     [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.STUDY) ],
    //     [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.STUDY) ]
    //   ])],
    //   [ElementKind.SURVEY_PROGRAM, new Map<ActionKind, boolean>([
    //     [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.SURVEY_PROGRAM) ],
    //     [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.SURVEY_PROGRAM) ],
    //     [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.SURVEY_PROGRAM) ]
    //   ])]
    // ]);
  }


  getRevisionsById<S extends IEntityAudit>(elementKind: ElementKind, id: string): Promise<IPageResult<IRevisionResult<S>>>  {
    const qe = getQueryInfo(elementKind);
    if (qe.id === ElementKind.CONCEPT || qe.id === ElementKind.TOPIC_GROUP) {
      return this.http.get<IPageResult<IRevisionResult<S>>>
      (this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
    } else {
      return this.http.get<IPageResult<IRevisionResult<S>>>
      (this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
    }
    return new Promise(null);
  }

  getElementByName<S extends IEntityAudit>(elementKind: ElementKind, name: string): Promise<IPageResult<S>> {
    const qe = getQueryInfo(elementKind);
    return this.http.get<IPageResult<S>>(this.api + qe.path + '/page/search/?name=*' + name + '*' ).toPromise();
  }

  copySource<S extends IEntityAudit>(elementKind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<S> {
    const qe = getQueryInfo(elementKind);
    return this.http.post<S>(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  create(item: T, parentId?: string): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    return this.http.post<T>(this.api + qe.path + '/create/' + parentId, item);
  }

  update(item: T): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    return this.http.post<T>(this.api + qe.path, item);
  }

  updateAll(items: T[]): Observable<T[]> {
    const qe = getQueryInfo(items[0].classKind);
    return this.http.post<T[]>(this.api + qe.path + '/list', items);
  }

  updateWithFiles( form: FormData ): Observable<T> {
    return this.http.post<T>( this.api +  this.qe.path + '/createfile/', form, { reportProgress: true} );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.api + this.qe.path + '/delete/' + id, {responseType: 'text'});
  }

  getPdf(element: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(element.classKind);
    return this.http.get(this.api +  qe.path + '/pdf/' + element.id, { responseType: 'blob'})
      .toPromise();
  }

  getXml(element: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(element.classKind);
    return this.http.get(this.api +  qe.path + '/xml/' + element.id, { responseType: 'blob'})
      .toPromise();
  }

  getFile(om: IOtherMaterial): Promise<Blob> {
    // /files/{root}/{filename}
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob'})
      .toPromise();
  }

  async get(id: string) {
    return await this.http.get<T>(this.api + this.qe.path + id).toPromise();
  }

  async getExt<S extends IEntityAudit>(elementKind: ElementKind, id: string) {
    const qe = getQueryInfo(elementKind);
    return await this.http.get<S>(this.api + qe.path + id).toPromise();
  }

  getByParent(parentId: string): Promise<T[]> {
    return this.http.get<T[]>(this.api + this.qe.path + '/list/by-parent/' + parentId).toPromise();
  }

  /// Only for Concept
  getPageByParent(parentId: string): Promise<IPageResult<T>> {
    return this.http.get<IPageResult<T>>(this.api + this.qe.path + '/page/by-parent/' + parentId).toPromise();
  }

  attachQuestion(id: string, questionId: string, revision: number): Observable<any> {
    if (revision === null) {
      revision = 0;
    }
    return this.http.post(this.api +  this.qe.path + '/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&topicid=' + id , {});
  }

  deattachQuestion(id: string, questionId: string, revision: number): Observable<any> {
    return this.http.post(this.api +  this.qe.path + '/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&id=' + id, {});
  }

  // getByTopicConcept(topicId: string): Promise<IPageResult<Concept>> {
  //   return this.http.get<IPageResult<Concept>>(this.api + 'concept/page/by-topicgroup/' + topicId + '?page=0&size=50')
  //     .toPromise();
  // }
  //
  // getByStudyTopic(studyId: string): Promise<Topic[]> {
  //   return this.http.get<Topic[]>(this.api + 'topicgroup/list/by-study/' + studyId).toPromise();
  // }
  //
  // getBySurveyStudy(surveyProgramId: String): Promise<SurveyProgram> {
  //   return this.http.get<SurveyProgram>(this.api + 'surveyprogram/' + surveyProgramId).toPromise();
  // }
  //
  // getByUserSurvey(): Promise<any> {
  //   return this.http.get(this.api + 'surveyprogram/list/by-user')
  //     .toPromise();
  // }

  // createSurvey(surveyProgram: SurveyProgram): Observable<any> {
  //   return this.http.post(this.api + 'surveyprogram/create', surveyProgram);
  // }
  //
  // createStudy(study: Study, surveyProgramId: String): Observable<any>  {
  //   return this.http.post(this.api + 'study/create/' + surveyProgramId, study);
  // }
  //
  // createTopic(topic: Topic, studyId: string): Observable<any> {
  //   return this.http.post(this.api + 'topicgroup/create/' + studyId, topic);
  // }

  // createConcept(concept: Concept, topicId: string): Observable<any> {
  //   return this.http.post(this.api + 'concept/create/by-topicgroup/' + topicId, concept);
  // }

  // createChildConcept(concept: any, parentId: string): Observable<any> {
  //   return this.http.post(this.api + 'concept/create/by-parent/' + parentId, concept);
  // }
  //
  // deleteConcept(conceptId: string): Observable<string> {
  //   return this.http.delete(this.api + 'concept/delete/' + conceptId , { responseType: 'text'});
  // }
  //
  // deleteTopic(topicId: string): Observable<any> {
  //   return this.http.delete(this.api + 'topicgroup/delete/' + topicId);
  // }
  //
  // deleteStudy(id: string): Observable<any>  {
  //   return this.http.delete(this.api + 'study/delete/' + id);
  // }
  //
  // deleteSurvey(id: string): Observable<any>  {
  //   return this.http.delete(this.api + 'surveyprogram/delete/' + id);
  // }
  // attachConceptQuestion(conceptId: string, questionId: string, revision: number): Observable<any> {
  //   if (revision === null) {
  //     revision = 0;
  //   }
  //   return this.http.post(this.api + 'concept/combine?questionitemid=' + questionId +
  //     '&questionitemrevision=' + revision +
  //     '&id=' + conceptId, {});
  // }
  //
  // attachTopicQuestion(topicId: string, questionId: string, revision: number): Observable<any> {
  //   if (revision === null) {
  //     revision = 0;
  //   }
  //   return this.http.post(this.api + 'topicgroup/combine?questionitemid=' + questionId +
  //     '&questionitemrevision=' + revision + '&topicid=' + topicId, {});
  // }
  //
  // deattachConceptQuestion(conceptId: string, questionId: string, revision: number): Observable<any> {
  //   return this.http.post(this.api + 'concept/decombine?questionitemid=' + questionId +
  //     '&questionitemrevision=' + revision +
  //     '&conceptid=' + conceptId, {});
  // }
  //
  // deattachTopicQuestion(topicId: string,  questionId: string, revision: number): Observable<any> {
  //   return this.http.post(this.api + 'topicgroup/decombine?questionitemid=' + questionId +
  //     '&questionitemrevision=' + revision +
  //     '&topicid=' + topicId, {});
  // }


  // getStudy(id: String): Promise<any> {
  //   return this.http.get(this.api + 'study/' + id).toPromise();
  // }

  // getTopic(id: string): Promise<any> {
  //   return this.http.get(this.api + 'topicgroup/' + id).toPromise();
  // }

  // attachStudyAuthor(studyId: string, authorId: string): Observable<any> {
  //   return this.http.post(this.api + 'author/combine?authorId=' + authorId + '&studyId=' + studyId, {});
  // }
  //
  //
  // deattachStudyAuthor(studyId: string, authorId: string): Observable<any>  {
  //   return this.http.delete(this.api + 'author/decombine?authorId=' + authorId + '&studyId=' + studyId);
  // }


}
