import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataProviderService } from './services/data-provider.service';
import { CommonModule } from '@angular/common';

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
  @ViewChild("srAnnouncement", {static: false})
  set watch(el: ElementRef) {
    if (el) {
      setTimeout(() => {
        (el.nativeElement as HTMLElement).setAttribute("aria-hidden", "true");
      }, 0);
    }
  }
  constructor(private dataService: DataProviderService) {}
  ngOnInit(): void {
    this.dataService.getHeading().subscribe((val) => {
      this.headerText = val ?? "";
      this.title = val;
    });
    this.dataService.getA11yText().subscribe((val) => {
      this.loaderText = val ?? "page has been loaded";
    });
  }

}
