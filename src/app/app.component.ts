import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataProviderService } from './services/data-provider.service';
import { BehaviorSubject, Observable, forkJoin, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

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
