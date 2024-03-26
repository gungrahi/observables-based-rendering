import { Injectable } from '@angular/core';
import { Observable, map, timer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor() { }

  getHeading(): Observable<string> {
    return timer(1000).pipe(map((_) => "observables-based-rendering"));
  }

  getA11yText(): Observable<any> {
    return timer(2000).pipe(map((_) => [
      {
        "text": {
          "A11Y_PAGE_LOADED": "page has been loaded"
        }
      }
    ]));
  }
}
