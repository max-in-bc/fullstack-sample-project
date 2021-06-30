import { LoginService } from '@services/login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {


  unsub: Subject<any> = new Subject<any>(); //my favourite way to not have hanging requests upon destroy
  loginGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])

  });


  validationError: string = null;

  constructor(private _loginService: LoginService, private _router: Router, private _ngxLoader: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  login() {
    this._ngxLoader.show();
    this.validationError = null;

    const password = this.loginGroup.get('password').value;
    const username = this.loginGroup.get('username').value;

    this._loginService
      .login(username, password)
      .pipe(
        takeUntil(this.unsub)
      )
      .subscribe(
        () => {
          this._router.navigate(['/home'])
          this._ngxLoader.hide();
        },
        (response: HttpErrorResponse) => {
          // handle login failure
          this.validationError = 'Authentication ' + response.error;
          console.error(response.error);
          this._ngxLoader.hide();
        }
      );
  }

  ngOnDestroy(){
    this.unsub.next();
    this.unsub.complete();
  }

}
