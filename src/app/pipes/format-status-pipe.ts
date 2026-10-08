import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatStatus',
})
export class FormatStatusPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
}
