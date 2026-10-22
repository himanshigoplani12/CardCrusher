import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Data, CardFormState } from '../../services/data';

const MAX_CRITERIA = 10;
const MAX_DESCRIPTION = 255;

function parseCriteria(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function maxCriteriaValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const count = parseCriteria(control.value ?? '').length;
    return count > max ? { maxCriteria: { max, actual: count } } : null;
  };
}

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-card-form',
  styleUrl: './card-form.scss',
  templateUrl: './card-form.html',
})

export class CardFormComponent {
  private dataService = inject(Data);
  private fb = inject(FormBuilder);

  state = signal<CardFormState | null>(null);
  columnOptions = this.dataService.getColumnOptions();

  readonly maxCriteria = MAX_CRITERIA;
  readonly maxDescription = MAX_DESCRIPTION;

  get criteriaCount(): number {
    return parseCriteria(this.form.controls.criteria.value ?? '').length;
  }

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', [Validators.maxLength(MAX_DESCRIPTION)]],
    storyPoints: [1, [Validators.required, Validators.min(1), Validators.max(21)]],
    columnId: [1],
    criteria: ['', [maxCriteriaValidator(MAX_CRITERIA)]]
  });

  constructor() {
    this.dataService.formState$
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        this.state.set(state);
        if (state) {
          this.initForm(state);
        }
      });
  }

  private initForm(state: CardFormState) {
    if (state.mode === 'edit' && state.card) {
      const card = state.card;
      this.form.reset({
        title: card.title,
        description: card.description,
        storyPoints: card.storyPoints,
        columnId: 1,
        criteria: card.acceptanceCriteria.map(c => c.text).join('\n')
      });
    } else {
      this.form.reset({
        title: '',
        description: '',
        storyPoints: 1,
        columnId: 1,
        criteria: ''
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const criteria = parseCriteria(value.criteria ?? '');

    const cardData = {
      title: value.title.trim(),
      description: value.description.trim(),
      storyPoints: value.storyPoints
    };

    const state = this.state(); 
    if (state?.mode === 'edit' && state.card) {
      this.dataService.updateCard(state.card.id, cardData, criteria);
    } else {
      this.dataService.addCard({ ...cardData, criteria }, value.columnId);
    }

    this.dataService.closeForm();
  }

  cancel() {
    this.dataService.closeForm();
  }
}