import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryStatus } from './enquiry-status';

describe('EnquiryStatus', () => {
  let component: EnquiryStatus;
  let fixture: ComponentFixture<EnquiryStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
