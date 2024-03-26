import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataProviderService } from './services/data-provider.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, of, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = "";
  headerData$!: Observable<string>;
  a11yData$!: Observable<any>;
  @ViewChild("srLiveRegionContainer") srLiveRegionContainer!: ElementRef<HTMLElement>;

  constructor(private dataService: DataProviderService) {}
  ngOnInit(): void {
    this.getHeadingData();
    this.getA11yData();
    this.announcePageLoadedStatus(this.getCombinedObservable());
  }

  getCombinedObservable() {
    return combineLatest({
      a: this.headerData$,
      b: this.a11yData$
    }).pipe(take(1))
      .pipe(map((res => {
        let loaderText!: string;
        const headerText = new DOMParser().parseFromString(res.a, "text/html").body.innerText;
        if (res.b && res.b[0] && res.b[0] && res.b[0]["text"] && res.b[0]["text"]["A11Y_PAGE_LOADED"] && res.b[0]["text"]["A11Y_PAGE_LOADED"] !== 'UNRESOLVED_TEXT') {
          loaderText = res.b[0]["text"]["A11Y_PAGE_LOADED"];
        } else {
          loaderText = "page has been loaded";  //fallback value
        }
        return headerText + " " + loaderText;
      })));
  }

  announcePageLoadedStatus(srAnnouncement$: Observable<string>) {
    srAnnouncement$.subscribe((announcement) => {
      let el = document.createElement("p");
      el.innerHTML = announcement;
      this.srLiveRegionContainer.nativeElement.appendChild(el);
      setTimeout(() => {
        this.srLiveRegionContainer.nativeElement.setAttribute("aria-hidden", "true");
      }, 500);
    });
  }

  getA11yData() {
    try {
      this.a11yData$ = this.dataService.getA11yText();
      this.a11yData$.subscribe(data => {
        // some logic
      });
    } catch (error) {
      this.a11yData$ = of([]);
      console.log("Error in getA11yData()", error);
    }
  }

  getHeadingData() {
    try {
      this.headerData$ = this.dataService.getHeading();
      this.headerData$.subscribe(data => {
        this.title = data;
        // some logic
      });
    } catch (error) {
      this.title = "";
      this.headerData$ = of("");
      console.log("Error in getHeadingData()", error);
    }
  }

}
