import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, Route,
         ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';
import { PropertyStoreService } from '../global/property.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild  {

  private menupath = ['survey', 'study', 'topic', 'concept'];

  constructor(private authService: UserService, private router: Router, private property: PropertyStoreService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//    console.log('can active?');
    if (!this.authService.isTokenExpired()) {
//      console.log('YES');
      if (this.checkParent(next.url.toString())) {
        return true;
      }
      this.router.navigate(['/home']);
    }
//    console.log('NO');
    this.router.navigate(['/login']); // , { queryParams: { returnUrl: 'home' }});
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//    console.log('can Activate Child?');
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
//    console.log('can load?');
    const url = `/${route.path}`;
    return !this.authService.isTokenExpired();
  }

  private checkParent(url: string): boolean {
    console.log('check Parent?');
    const index = this.menupath.findIndex((e) => e === url);
    if (index === -1) {
      this.property.set('currentUrl', null);
    } else {
      this.property.set('currentUrl', url);
    }

    if (index > 0) {
      return (this.property.get(this.menupath[index - 1]));
    }
    return true;
  }
}
