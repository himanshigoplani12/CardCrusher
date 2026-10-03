import { Component, Input } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.scss',
  templateUrl: './card.html',
})
export class CardComponent {
  @Input() card!: Card;

  get assigneeInitials(): string {
    return this.card.assignee
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
}
