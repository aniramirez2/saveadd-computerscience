import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SERVICE_API} from '../app.api';


@Injectable()
export class ConfigService {
  constructor(public http: HttpClient) { }


  getConfig() {
    return this.http.get(`${SERVICE_API}/usuarios`);
  }
}
