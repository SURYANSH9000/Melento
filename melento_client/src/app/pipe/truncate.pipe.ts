import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 3): string {
    if (!value) return '';

    let words = value.split(' ');
    if (words.length <= limit) {
      return value;
    }

    return words.slice(0, limit).join(' ') + '...';
  }
}
