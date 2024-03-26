import { TestBed, waitForAsync } from '@angular/core/testing';

import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should get heading", waitForAsync(() => {
    service.getHeading().subscribe(data => {
      expect(data).toEqual("observables-based-rendering");
    });
  }));
  it("should get a11yData", waitForAsync(() => {
    service.getA11yText().subscribe(data => {
      expect(data[0]["text"]).toEqual({
        "A11Y_PAGE_LOADED": "page has been loaded"
      });
    });
  }));
});
