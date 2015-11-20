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
  AsyncTestCompleter,
  tick
} from 'angular2/testing';
import {SurveyService} from "./surveyservice";
import {SurveyService} from "./surveyservice";
import {SurveyProgram} from "./create/create";
import FancyService from "./";

class FancyService {
  value: string = 'real value';
  getAsyncValue() { return Promise.resolve('async value'); }
}

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
      provide(SurveyService, {useClass: SurveyService}),
      provide(FancyService, {useClass: FancyService()})
    ]);

    it('should return the list of names',(inject([SurveyService], (surveyService) => {
      //let surveys = surveyService.getAll();
      //expect(surveys).toEqual(jasmine.any(Array));
      var hello = surveyService.test();
      expect(hello).toEqual("hello");
    })));

    //it('test http', (injectAsync([Http], (http) => {
    //  var headers = new Headers();
    //  headers.append('Authorization', 'Basic ' + btoa('client:password'));
    //  http.post('http://localhost:8080/oauth/token' +
    //      '?username=admin@example.org' +
    //      '&password=password' +
    //      '&scope=write' +
    //      '&grant_type=password' +
    //      '&client_secret=password' +
    //      '&client=client',
    //    null
    //    ,
    //    {
    //      headers: headers
    //    })
    //    .map(res => res.json())
    //    .subscribe(
    //      //data  => token = JSON.stringify(data),
    //      data  => console.log('JWT', data),
    //      err   => this.logError(err),
    //      ()    => console.log('Done')
    //    );
    //
    //})));
  });
}
