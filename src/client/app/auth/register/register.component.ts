import { Component, OnInit } from '@angular/core';
import { Router,
         NavigationExtras } from '@angular/router';
import { AuthService }      from './../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	
  model: any = {};
  message: string;

  constructor(public authService: AuthService, public router: Router) {
  	this.message = '';
  }

  ngOnInit() {
  }

  register() {
    this.message = 'Registering your account ...';

    this.authService.register(this.model).subscribe(result=>{
   
      let storeData: any = {
          token: result.password,
          email: result.email
        };
        localStorage.setItem('currentUser', JSON.stringify(storeData));
        this.authService.isLoggedIn = true;
        this.message = 'Registration success!';
        setTimeout(()=>{
          if (this.authService.isLoggedIn) {
            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';

            // Set our navigation extras object
            // that passes on our global query params and fragment
            let navigationExtras: NavigationExtras = {
              queryParamsHandling: 'preserve',
              preserveFragment: true
            };

            // Redirect the user
            this.router.navigate([redirect], navigationExtras);
          }

        },2000);

    },
    error=>{
      console.log(error);
    })

  }

}
