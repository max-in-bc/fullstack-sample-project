import { ServiceI } from '@services/log.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { LogService } from '@services/log.service';
import { LoginService } from '@services/login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
  constructor(private loginService: LoginService, private logService: LogService) { }


  ngOnInit(): void {
    this.logService.getAvailableLogServices().pipe(takeUntil(this.unsub)).subscribe((services: ServiceI[]) => {
      this.services = services;
    })
  }

  async logout(){
    this.loginService.logout();
  }

  selectedServiceChanged(){
    this.selectedServiceLog$ = this.logService.getAvailableLogsForService(this.selectedService.id).pipe(takeUntil(this.unsub));
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }


}
