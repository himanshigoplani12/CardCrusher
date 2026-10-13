import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Data, CardFormState } from '../../services/data';

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

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    description: [''],
    storyPoints: [1, [Validators.required, Validators.min(1), Validators.max(21)]],
    columnId: [1],
    criteria: ['']
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
    const criteria = value.criteria
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

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