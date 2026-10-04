import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Data } from '../../services/data';

@Component({
  imports: [CommonModule],
  selector: 'app-card-modal',
  styleUrl: './card-modal.scss',
  templateUrl: './card-modal.html',
})
export class CardModalComponent {
  private dataService = inject(Data);
  selectedCard$ = this.dataService.selectedCard$;

  closeModal() {
    this.dataService.closeCardModal();
  }
}
