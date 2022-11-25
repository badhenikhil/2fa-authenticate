import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register2faComponent } from './register2fa.component';

describe('Register2faComponent', () => {
  let component: Register2faComponent;
  let fixture: ComponentFixture<Register2faComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Register2faComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
