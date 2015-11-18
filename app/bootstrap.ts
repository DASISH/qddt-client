import {bind, bootstrap} from 'angular2/angular2';
import {ROUTER_BINDINGS, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppCmp} from './components/app/app';
import {UserService} from './common/userservice';

bootstrap(AppCmp, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppCmp),
  HTTP_PROVIDERS,
  UserService
]);

//  .then(
//    success   =>  console.log('Starting application.'),
//    error    =>  console.log('Starting application failed.')
//);
