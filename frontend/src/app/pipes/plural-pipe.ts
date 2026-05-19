import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: false,
})
export class PluralPipe implements PipeTransform {
  transform(value: number, word: string): string {
    if (word === 'год') {
      const lastDigit = value % 10;
      const lastTwoDigits = value % 100;
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
      if (lastDigit === 1) return 'год';
      if (lastDigit >= 2 && lastDigit <= 4) return 'года';
      return 'лет';
    }
    return '';
  }
}