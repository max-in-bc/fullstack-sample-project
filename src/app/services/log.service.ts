import { Injectable } from '@angular/core';

export interface ServiceLog{
  serviceName: string,
  logs: string
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  getAvailableLogServices(){

  }
}
