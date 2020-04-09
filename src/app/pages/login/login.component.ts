import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  remember = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.remember = true;
    }
  }

  login( form: NgForm) {
    if ( form.invalid ) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Please wait...'
    });
    Swal.showLoading();

    this.auth.login( this.user ).subscribe( result => {
      Swal.close();
      if (this.remember) {
        localStorage.setItem('email', this.user.email);
      };
      this.router.navigateByUrl('/home');
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to authenticate',
        text: error.error.error.message
      });
    });
  }

}
