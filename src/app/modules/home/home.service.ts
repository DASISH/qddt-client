import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActionKind, ElementKind, getQueryInfo, IEntityAudit, IEntityEditAudit, IOtherMaterial, IPageResult} from '../../classes';
import {Concept, Study, SurveyProgram, Topic} from '../../classes/home.classes';
import {UserService} from '../core/services';
import { API_BASE_HREF } from '../../api';



@Injectable()
export class HomeService {
  public readonly canDo: Map<ElementKind, Map<ActionKind, boolean>>;

  constructor( private userService: UserService, protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    this.canDo = new Map<ElementKind, Map<ActionKind, boolean>>([
      [ElementKind.CONCEPT, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.CONCEPT) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.CONCEPT) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.CONCEPT) ]
      ])],
      [ElementKind.TOPIC_GROUP, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.TOPIC_GROUP) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.TOPIC_GROUP) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.TOPIC_GROUP) ]
      ])],
      [ElementKind.STUDY, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.STUDY) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.STUDY) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.STUDY) ]
      ])],
      [ElementKind.SURVEY_PROGRAM, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.SURVEY_PROGRAM) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.SURVEY_PROGRAM) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.SURVEY_PROGRAM) ]
      ])]
    ]);
  }

  getRevisionById(kind: ElementKind, id: string): Promise<any> {
    const qe = getQueryInfo(kind);
    if (qe) {
      return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
    }
    return  Promise.resolve([]);
  }

  getElementByTypeAndName(kind: ElementKind, name: string): Promise<any> {
    const qe = getQueryInfo(kind);
    if (qe) {
      return this.http.get(this.api + qe.path + '/page/search/?name=*' + name + '*' ).toPromise();
    }
    return Promise.resolve([]);
  }

  update(item: IEntityAudit): Observable<any> {
    const qe = getQueryInfo(item.classKind);
    return this.http.post(this.api + qe.path, item);
  }

  updateWithFiles(kind: ElementKind, form: FormData ): Observable<any> {
    const qe = getQueryInfo(kind);
    // const req = new HttpRequest('POST', this.api +  qe.path + '/createfile/', form, { reportProgress: true });
    // return this.http.request(req);
    return this.http.post( this.api +  qe.path + '/createfile/', form, { reportProgress: true} );
  }

  getElementKind(kind: string|ElementKind): ElementKind {
    return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
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

  getFile(om: IOtherMaterial): Promise<any> {
    // /files/{root}/{filename}
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob'})
      .toPromise();
  }

  copySource(kind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<any> {
    const qe = getQueryInfo(kind);
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  getConcept(conceptId: string): Promise<any> {
    return this.http.get(this.api + 'concept/' + conceptId).toPromise();
  }

  getConceptByTopic(topicId: string): Promise<IPageResult<Concept>> {
    return this.http.get<IPageResult<Concept>>(this.api + 'concept/page/by-topicgroup/' + topicId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getTopicByStudy(studyId: string): Promise<Topic[]> {
    return this.http.get<Topic[]>(this.api + 'topicgroup/list/by-study/' + studyId).toPromise();
  }

  getStudyBySurvey(surveyProgramId: String): Promise<SurveyProgram> {
    return this.http.get<SurveyProgram>(this.api + 'surveyprogram/' + surveyProgramId).toPromise();
  }

  getSurveyByUser(): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/list/by-user')
      .toPromise();
  }

  createSurvey(surveyProgram: SurveyProgram): Observable<any> {
    return this.http.post(this.api + 'surveyprogram/create', surveyProgram);
  }

  createStudy(study: Study, surveyProgramId: String): Observable<any>  {
    return this.http.post(this.api + 'study/create/' + surveyProgramId, study);
  }

  createTopic(topic: Topic, studyId: string): Observable<any> {
    return this.http.post(this.api + 'topicgroup/create/' + studyId, topic);
  }

  createConcept(concept: Concept, topicId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-topicgroup/' + topicId, concept);
  }

  createChildConcept(concept: any, parentId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-parent/' + parentId, concept);
  }

  deleteConcept(conceptId: string): Observable<any> {
    return this.http.delete(this.api + 'concept/delete/' + conceptId , { responseType: 'text'});
  }

  deleteTopic(topicId: string): Observable<any> {
    return this.http.delete(this.api + 'topicgroup/delete/' + topicId);
  }

  deleteStudy(id: string): Observable<any>  {
    return this.http.delete(this.api + 'study/delete/' + id);
  }

  deleteSurvey(id: string): Observable<any>  {
    return this.http.delete(this.api + 'surveyprogram/delete/' + id);
  }

  attachConceptQuestion(conceptId: string, questionId: string, revision: number): Observable<any> {
    if (revision === null) {
      revision = 0;
    }
    return this.http.post(this.api + 'concept/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  attachTopicQuestion(topicId: string, questionId: string, revision: number): Observable<any> {
    if (revision === null) {
      revision = 0;
    }
    return this.http.post(this.api + 'topicgroup/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&topicid=' + topicId, {});
  }

  deattachConceptQuestion(conceptId: string, questionId: string, revision: number): Observable<any> {
    return this.http.post(this.api + 'concept/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  deattachTopicQuestion(topicId: string,  questionId: string, revision: number): Observable<any> {
    return this.http.post(this.api + 'topicgroup/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&topicid=' + topicId, {});
  }


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
