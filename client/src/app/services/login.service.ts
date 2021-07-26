import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _authToken: string = null;
  public get authToken(): string{
    return this._authToken;
  }

  public get isAuthenticated(): boolean{
    return this._authToken !== null;
  }

  constructor(private _http: HttpClient, private _router: Router) {
    /* PERSISTAUTH
    let _authToken = sessionStorage.getItem('authToken'); //to persist authentication for length of session

    if (_authToken){
      this._authToken = _authToken;
    }
    */
  }


  login(username: string, password: string): Observable<string> {
    return this._http
      .post(`${environment.baseUrl}api/login`, {
        username,
        password
      }, {responseType: 'text'}) //returns the auth token as a string directly - we persist to storage for now
      .pipe(map((_authToken: string) => {
        this._authToken = _authToken;
        /* PERSISTAUTH
        sessionStorage.setItem('authToken',_authToken);
        */
        return  this._authToken;
      }));
  }

  logout(){
    this._authToken = null;
    /* PERSISTAUTH
    sessionStorage.removeItem('authToken' );
    */
    this._router.navigate(['/login'])
  }


}
