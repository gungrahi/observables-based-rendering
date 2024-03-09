import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataProviderService } from './services/data-provider.service';
import { CommonModule } from '@angular/common';
import { combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = "";
  headerText: string | undefined;
  loaderText: string | undefined;
  @ViewChild("srAnnouncement") el!: ElementRef;

  constructor(private dataService: DataProviderService) {}
  ngOnInit(): void {
    const ob1$ = this.dataService.getHeading();
    const ob2$ = this.dataService.getA11yText();
    ob1$.subscribe((val) => {
      // this.headerText = val ?? "";
      this.title = val;
    });
    ob2$.subscribe((val) => {
      // this.loaderText = val ?? "page has been loaded";
    });
    combineLatest({
      a: ob1$,
      b: ob2$
    }).pipe(take(1))
      .subscribe(res => {
        this.headerText = res.a ?? "";
        this.loaderText = res.b ?? "page has been loaded";
        setTimeout(() => {
          (this.el.nativeElement as HTMLElement).setAttribute("aria-hidden", "true");
        }, 10);
      });
  }

}
