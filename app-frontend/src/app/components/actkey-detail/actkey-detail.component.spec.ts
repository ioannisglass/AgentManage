import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActkeyDetailComponent } from './actkey-detail.component';

describe('ActkeyDetailComponent', () => {
  let component: ActkeyDetailComponent;
  let fixture: ComponentFixture<ActkeyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActkeyDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActkeyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
