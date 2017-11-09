/*
Service to communicate with Backend. Get and Post methods
*/
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class HTTPService {
  constructor (private http: Http, private router: Router) {}
  getCurrentState (email: any, client: any, origin_source: any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_email', email);
    params.set('client', client );
    params.set('origin_source', origin_source);
     return this.http.get('https://www.phonetik.uni-muenchen.de/apps/elles-ci/index.php/API/lesson', {params: params})
       .map(res => res.json());
  }


  navigate2(part: string, planetNumber: number): void {
    this.router.navigate( [part], { queryParams: { 'planet': planetNumber } });
  }


  postJSON(data: any) {
    const json = JSON.stringify(data);
    const params = json;
    const headers = new Headers();
    headers.append('Content-Type',
   // 'application/x-www-form-urlencoded');
    'application/json');

    return this.http.post('https://www.phonetik.uni-muenchen.de/apps/elles-ci/index.php/API/lesson',
      params, {
      headers: headers
      })
  }
}
