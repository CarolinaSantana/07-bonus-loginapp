import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  remember = false;

  constructor( private auth: AuthService, 
               private router: Router ) { }

  ngOnInit() { 
    this.user = new UserModel();
  }


  onSubmit( form: NgForm ) {
    if ( form.invalid ) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Wait please...'
    });
    Swal.showLoading();
    this.auth.newUser(this.user).subscribe( result => {
      Swal.close();
      if (this.remember) {
        localStorage.setItem('email', this.user.email);
      }
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
