/*
* Shared service for title of texts
*/

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';



@Injectable()
export class SharedService {
  // Observable string source
  private dataStringSource = new Subject<string>();

  // Observable string stream
  dataString$ = this.dataStringSource.asObservable();

  // Service message commands
  insertData(data: string) {
    this.dataStringSource.next(data);
  }
}
