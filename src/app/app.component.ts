import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataProviderService } from './services/data-provider.service';
import { CommonModule } from '@angular/common';
import { combineLatest, map, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = "";
  @ViewChild("srLiveRegionContainer") srLiveRegionContainer!: ElementRef<HTMLElement>;

  constructor(private dataService: DataProviderService) {}
  ngOnInit(): void {
    const ob1$ = this.dataService.getHeading();
    const ob2$ = this.dataService.getA11yText();
    ob1$.subscribe((val) => {
      this.title = val;
      // some logic
    });
    ob2$.subscribe((val) => {
      // some logic
    });
    const srAnnouncement$ = combineLatest({
      a: ob1$,
      b: ob2$
    }).pipe(take(1))
      .pipe(map((res => {
        const headerText = res.a ?? "";
        const loaderText = res.b ?? "page has been loaded";
        return headerText + " " + loaderText;
      })));
    srAnnouncement$.subscribe((announcement) => {
      let el = document.createElement("p");
      el.innerHTML = announcement;
      this.srLiveRegionContainer.nativeElement.appendChild(el);
      setTimeout(() => {
        this.srLiveRegionContainer.nativeElement.setAttribute("aria-hidden", "true");
      }, 500);
    });
  }

}
