import {TopicService} from './topicservice';
import {LoginComponent} from '../login/login'
import {Inject, provide, Dependency, bind} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Headers, BaseRequestOptions, MockBackend} from '../../../node_modules/angular2/http.d';

import {
  beforeEachProviders,
  describe,
  expect,
  iit,
  inject,
  it,
  injectAsync,
  fakeAsync,
  TestComponentBuilder,
  tick
} from '../../../node_modules/angular2/testing.d';
import {Topic} from "./create/create";

export function main() {
  describe('SurveyService Service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {useFactory:
        function(backend, defaultOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]}),
      provide(TopicService, {useClass: TopicService})
    ]);

    it('should return a list of surveys',(inject([TopicService], (topicService) => {
      //let surveys = surveyService.getAll();
      //expect(surveys).toEqual(jasmine.any(Array));
    })));

  });
}
