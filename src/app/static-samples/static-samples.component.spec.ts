import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticSamplesComponent } from './static-samples.component';

describe('StaticSamplesComponent', () => {
  let component: StaticSamplesComponent;
  let fixture: ComponentFixture<StaticSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticSamplesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
