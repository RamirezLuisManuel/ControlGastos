import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTokenComponent } from './correo-form.component';

describe('CorreoFormComponent', () => {
  let component: AuthTokenComponent;
  let fixture: ComponentFixture<AuthTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
