import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiryDetails } from './equiry-details';

describe('EquiryDetails', () => {
  let component: EquiryDetails;
  let fixture: ComponentFixture<EquiryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
