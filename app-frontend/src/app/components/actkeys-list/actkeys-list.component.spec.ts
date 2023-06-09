import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActkeysListComponent } from './actkeys-list.component';

describe('ActkeysListComponent', () => {
  let component: ActkeysListComponent;
  let fixture: ComponentFixture<ActkeysListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActkeysListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActkeysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
