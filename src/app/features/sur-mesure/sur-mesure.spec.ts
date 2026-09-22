import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurMesure } from './sur-mesure';

describe('SurMesure', () => {
  let component: SurMesure;
  let fixture: ComponentFixture<SurMesure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurMesure],
    }).compileComponents();

    fixture = TestBed.createComponent(SurMesure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
