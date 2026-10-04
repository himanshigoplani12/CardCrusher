import { Component, inject, Input } from '@angular/core';
import { Card } from '../../models/card.model';
import { Data } from '../../services/data';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.scss',
  templateUrl: './card.html',
})
export class CardComponent {
  @Input() card!: Card;
  private dataService = inject(Data);

  get assigneeInitials(): string {
    return this.card.assignee
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
  
  openCard() {
    this.dataService.selectCard(this.card.id);
  }
}
