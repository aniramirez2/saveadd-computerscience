import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipo'
})
export class TipoRestricao implements PipeTransform {
    transform(value: number): string {
        
        if (!value || value < 1) {
          return String(value);
        }
        if (value === 1 ) {
            return 'Quantidade Mínima';
        } else if (value === 2 ) {
            return 'Quantidade Máxima';
        } else if (value === 3 ) {
            return 'Restrito a Empresa';
        }else if (value === 4 ) {
            return 'Restrito ao Estado';
        }
        else if (value === 5 ) {
            return 'Restrito a Cidade';
        }
        else if (value === 6 ) {
            return `Restrito a ONG's`;
        } 
        else if (value === 7 ) {
            return `Restrito a ONG's Conveniada`;
        } 
      }
}