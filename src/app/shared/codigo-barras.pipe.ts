import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codigos'
})
export class CodigoBarras implements PipeTransform {
    transform(value: number): string {
        switch(value) { 
            case 1 : { 
                return 'EAN 13';
               
            } 
            case 2: { 
                return 'DUN';
               
            } 
            case 2: { 
                return 'DUN';
                
            } 
            case 3: { 
                return 'Data Bar';
               
            } 
            case 4: { 
                return '128';
               
            } 
            case 5: { 
                return 'ITF';
               
            } 
            case 6: { 
                return 'Data Matrix';
            
            } 
            case 7: { 
                return 'Código Interno';
              
            } 
         } 
      }
}