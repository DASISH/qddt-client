import {SurveyService} from './surveyservice';
import {LoginComponent} from '../login/login'
import {Inject, provide, Dependency, bind} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Headers, BaseRequestOptions, MockBackend} from 'angular2/http';

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
} from 'angular2/testing';
import {SurveyService} from "./surveyservice";
import {SurveyService} from "./surveyservice";
import {SurveyProgram} from "./create/create";

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
      provide(SurveyService, {useClass: SurveyService})
    ]);

    it('should return a list of surveys',(inject([SurveyService], (surveyService) => {
      //let surveys = surveyService.getAll();
      //expect(surveys).toEqual(jasmine.any(Array));
    })));

  });
}
