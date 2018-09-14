import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
      console.log('isTokenExpired -> redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  // private checkParent(url: string): boolean {
  //   const current =  this.menupath.find((e) => e === url);
  //   this.property.set('currentUrl', current);
  //   if (current) {
  //     console.log( (current) );
  //     return true;
  //   }
  //   return false;
  // }
}
