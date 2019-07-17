import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minDigits'
})
export class MinDigitsPipe implements PipeTransform {
  transform(value: string, size: number): any {
    return value.padStart(size, '0');
  }
}
