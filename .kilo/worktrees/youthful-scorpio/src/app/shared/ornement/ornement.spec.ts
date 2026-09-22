import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ornement } from './ornement';

describe('Ornement', () => {
  let component: Ornement;
  let fixture: ComponentFixture<Ornement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ornement],
    }).compileComponents();

    fixture = TestBed.createComponent(Ornement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
