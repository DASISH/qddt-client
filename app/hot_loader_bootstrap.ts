// <reference path="../tools/typings/tsd/systemjs/systemjs.d.ts"/>

import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppCmp} from './components/app/app';
import {UserService} from './common/userservice';
import {SurveyService} from './components/surveyprogram/surveyservice';

System.import('//nsd349.nsd.lan:<%= HOT_LOADER_PORT %>/ng2-hot-loader')
  .then(loader => {
    loader.ng2HotLoaderBootstrap(AppCmp, [
      ROUTER_PROVIDERS,
      provide(LocationStrategy, { useClass: HashLocationStrategy }),
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS,
      UserService,
      provide(SurveyService, { useClass: SurveyService} ),
      SurveyService
    ]);
  });
