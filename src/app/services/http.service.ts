import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  get<T>(path: string, params: {} = {}) {
    return this.http
    .get(this.buildURL(path), this.buildOptions(params))
    .pipe(map(resp => this.marshalResponse(resp)));
  }

  post(path: string, payload: {}, params: {} = {}) {
    return this.http
    .post(this.buildURL(path), payload, this.buildOptions(params))
    .pipe(map(resp => this.marshalResponse(resp)));
  }

  private marshalResponse(resp) {
    if (environment.debug){
      console.group('<DEBUG>');
      console.info('<RESP>', resp);
      console.info('<RESP.headers>', resp.headers);
      console.info('<RESP.body>', resp.body);
      console.groupEnd();
    }
    return resp.body;
  }

  private buildOptions(params: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return Object.assign({}, {
      headers: headers,
      params: params,
    }, { observe: 'response' })
  }

  private buildURL(path: string) {
    if (path.charAt(0) !== '/') {
      path = `/${path}`;
    }
    return `${environment.apiURL}${path}`;
  }
}
