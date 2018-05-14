import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, Route,
         ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';
import { QddtPropertyStoreService } from '../global/property.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild  {

  private menupath = ['survey', 'study', 'topic', 'concept'];

  constructor(private authService: UserService, private router: Router, private property: QddtPropertyStoreService) {
    console.log('AuthGuard created');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
      return false;
    }
//    console.log(state);
//    console.log(next);
    if (this.checkParent(next.url.toString())) {
        return true;
    }
    this.router.navigate(['/home']);
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return !this.authService.isTokenExpired();
  }

  private checkParent(url: string): boolean {
//    console.log('check ' + url);
    const current =  this.menupath.find((e) => e === url);
    this.property.set('currentUrl', current);
    return true;
    // return (current !== undefined);
  }
}
