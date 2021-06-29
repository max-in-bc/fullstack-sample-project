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

  constructor(private _http: HttpClient, private _router: Router) { }


  login(username: string, password: string): Observable<string> {
    return this._http
      .post(`${environment.baseUrl}api/auth`, {
        userName:username,
        password
      }, {responseType: 'text'})
      .pipe(map((_authToken: string) => {
        this._authToken = _authToken;
        return  this._authToken;
      }));
  }

  logout(){
    this._authToken = null;
    this._router.navigate(['/login'])
  }


}
