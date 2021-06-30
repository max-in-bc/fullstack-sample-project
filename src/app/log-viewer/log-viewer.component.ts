
import { ServiceI } from '@services/log.service';
import { takeUntil, map, take } from 'rxjs/operators';
import { Subject, Observable, interval, timer } from 'rxjs';
import { LogService } from '@services/log.service';
import { LoginService } from '@services/login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {  NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.less']
})
export class LogViewerComponent implements OnInit, OnDestroy {

  services: ServiceI[] = [];
  selectedService: ServiceI = null;
  filterSearchString: string = '';
  filterRegexEnabled: boolean = false;
  highlightSearchString: string = '';
  highlightRegexEnabled: boolean = false;

  unsub: Subject<any> = new Subject<any>(); //my favourite way to not have hanging requests upon destroy

  selectedServiceLog$: Observable<string> = null;

  //I moved from template-driven input models because once the logs reached around 5-6mb the model binding was taking FOREVER and it appeared like the input wasnt even typing
  cancelHighlightSearch$ = new Subject<any>();
  cancelFilterSearch$ = new Subject<any>();
  constructor(private loginService: LoginService, private logService: LogService, private _ngxLoader: NgxSpinnerService) { }


  ngOnInit(): void {
    this._ngxLoader.show();
    this.logService.getAvailableLogServices().pipe(takeUntil(this.unsub)).subscribe((services: ServiceI[]) => {
      this.services = services;
      this._ngxLoader.hide();
    })
  }

  async logout(){
    this.loginService.logout();
  }

  selectedServiceChanged(){
    this._ngxLoader.show();
    this.selectedServiceLog$ = this.logService.getAvailableLogsForService(this.selectedService.id).pipe(takeUntil(this.unsub), map(log => {
      this._ngxLoader.hide();
      return  log;
    }));
  }

  //triggered on input change for the filter search bar - but only firing the model change event every 500 seconds resetting if fired before reaching the end of the interval
  //this acts to prevent the slow regex from being activated before the user has finished typing their search term
  highlightSearch(event: string  ){
    this.cancelHighlightSearch$.next();
    this._ngxLoader.show();
    timer(500).pipe(takeUntil(this.cancelHighlightSearch$)).subscribe(() => {
      this.highlightSearchString = event;
    })
  }

  //triggered on input change for the filter search bar - but only firing the model change event every 500 seconds resetting if fired before reaching the end of the interval
  //this acts to prevent the slow regex from being activated before the user has finished typing their search term
  filterSearch(event: string  ){
    this.cancelFilterSearch$.next();
    this._ngxLoader.show();
    timer(500).pipe(takeUntil(this.cancelFilterSearch$)).subscribe(() => {
      this.filterSearchString = event;
    })
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }


}
