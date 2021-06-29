import { LogService } from '@services/log.service';
import { LoginService } from '@services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.less']
})
export class LogViewerComponent implements OnInit {

  constructor(private loginService: LoginService, private logService: LogService) { }

  ngOnInit(): void {
  }

  async logout(){
    this.loginService.logout();
  }
}
