import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {API_BASE_HREF} from './api';
import {AppCmp} from './components/app/app.component';
import {UserService} from './common/user.service';
import {SurveyService} from './components/surveyprogram/survey.service';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppCmp, [
  provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' } ),
  provide(API_BASE_HREF, { useValue: '<%= API_BASE %>' } ),
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  UserService,
  provide(SurveyService, { useClass: SurveyService} ),
  SurveyService
]);


// In order to start the Service Worker located at "./sw.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful with scope: ',    registration.scope);
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed: ', err);
//   });
// }
