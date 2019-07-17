import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusCompra'
})
export class StatusCompra implements PipeTransform {
    transform(value: number): string {
        
        if (value === 0) {
          return 'Em processamento';
        }
        if (value === 1 ) {
            return 'Aprovado';
        } else if (value === 2 ) {
            return 'Faturado';
        } else if (value === 3 ) {
            return 'Entregue';
        }else if (value === 4 ) {
            return 'Negado';
        }
        else if (value === 5 ) {
            return 'Cancelado';
        }
        else if (value === 6 ) {
            return 'Aguardando Pagamento';
        }
        else if (value === 7 ) {
            return 'Despachado';
        }
        else if (value === 8 ) {
            return 'Liberado';
        }
        else if (value === 9 ) {
            return 'Pagamento Aprovado';
        }
      }
}