/*import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codigoBarras'
})
export class CodigoBarras implements PipeTransform {
    transform(value: number): string {
        
        if (!value || value < 1) {
          return String(value);
        }
        if (value === 1 ) {
            return 'EAN 13';
        } else if (value === 2 ) {
            return 'DUN';
        } else if (value === 3 ) {
            return 'Data Bar';
        }else if (value === 4 ) {
            return '128';
        }
        else if (value === 5 ) {
            return 'ITF';
        }
        else if (value === 6 ) {
            return 'Data Matrix';
        } else {
            return 'Código Interno';
        }
      }
}*/