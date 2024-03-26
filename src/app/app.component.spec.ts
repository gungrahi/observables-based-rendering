import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { DataProviderService } from './services/data-provider.service';

export class MockDataService {
  getHeading() {
    return of("observables-based-rendering");
  }
  getA11yText() {
    return of([
      {
        "text": {
          "A11Y_PAGE_LOADED": "page has been loaded"
        }
      }
    ]);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: DataProviderService, useClass: MockDataService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'observables-based-rendering' title`, () => {
    expect(component.title).toEqual('observables-based-rendering');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, observables-based-rendering');
  });

  it("should announce page loaded status", () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.srLiveRegionContainer.nativeElement.firstElementChild?.innerHTML).toEqual("observables-based-rendering page has been loaded");
  });

  it("should set srLiveRegionContainer with aria-hidden", fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    fixture.detectChanges();
    expect(component.srLiveRegionContainer.nativeElement.getAttribute("aria-hidden")).toEqual("true");
  }));

  it("should use default loader text when getA11yText() throws error", inject([DataProviderService], (DataProviderService: MockDataService) => {
    spyOn(DataProviderService, "getA11yText").and.throwError("ERROR");
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.srLiveRegionContainer.nativeElement.firstElementChild?.innerHTML).toEqual("observables-based-rendering page has been loaded");
  }));

  it(`should use '' text when getHeading() throws error`, inject([DataProviderService], (DataProviderService: MockDataService) => {
    spyOn(DataProviderService, "getHeading").and.throwError("ERROR");
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.srLiveRegionContainer.nativeElement.firstElementChild?.innerHTML).toEqual(" page has been loaded");
  }));
  it("should use fallback value for loader text", inject([DataProviderService], (DataProviderService: MockDataService) => {
    spyOn(DataProviderService, "getA11yText").and.callFake(() => {
      return of([]);
    });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.srLiveRegionContainer.nativeElement.firstElementChild?.innerHTML).toEqual("observables-based-rendering page has been loaded");
  }));
});
