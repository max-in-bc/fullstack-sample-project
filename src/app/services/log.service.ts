import { switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer, Subject, Observer } from 'rxjs';

export interface ServiceI{
  id: number,
  name: string,
  logs?: string
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private _http: HttpClient) { }

  getAvailableLogServices(): Observable<ServiceI[]>{
    return this._http.get<ServiceI[]>(environment.baseUrl + 'api/Services');
  }

  //preference would be to use websockets in this scenario, but the spec specifically asked for a REST api
  // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  getAvailableLogsForService(serviceId: number): Observable<string>{
    return timer(1, 3000).pipe( //run every 3 seconds like a poll making regular REST requests
      switchMap(() =>  this._http.get(environment.baseUrl + `api/Services/${serviceId}`, {responseType:'text'}))
   );

  }


}
