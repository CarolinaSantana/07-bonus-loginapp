import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = '';
  userToken: string;

  constructor( private http: HttpClient ) { 
    this.getToken();
  }

  logOut() {
    localStorage.removeItem('token');
  }

  login ( user: UserModel ) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      `${ this.url }signInWithPassword?key=${ this.apiKey }`,
           authData).pipe( map( result => {
            this.saveToken( result['idToken'] );
            return result;
          })
  );
  }

  newUser( user: UserModel ) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(`${ this.url }signUp?key=${ this.apiKey }`, authData);
  }
  
  private saveToken ( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let today = new Date();
    today.setSeconds( 3600 );
    localStorage.setItem('expires', today.getTime().toString());
  }

  getToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    } 

    const expires = Number(localStorage.getItem('expires'));
    const expiresDate = new Date();
    expiresDate.setTime(expires);

    if (expiresDate > new Date ()){
      return true;
    } else {
      return false;
    }
    
  }

}
