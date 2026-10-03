import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModal } from './card-modal';

describe('CardModal', () => {
  let component: CardModal;
  let fixture: ComponentFixture<CardModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CardModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
