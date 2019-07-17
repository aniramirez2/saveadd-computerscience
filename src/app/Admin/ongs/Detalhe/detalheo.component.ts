import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, StatusPedido } from '../../../providers/pedidos.service';
import { conformToMask } from 'angular2-text-mask';
import { masks } from '../../../masks';
import { EmpresaService } from '../../../providers/empresa.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html'
})
export class DetalheOngComponent implements OnInit {
  sub: any;
  idPedido: any;
  pedido: any = null;
  usuarios:any

  CodigoBarras: any = [
    {
      Codigo: null,
      TipoCodigoBarras: 1
    }
  ]
  ongs: any;
  estados: any;
  
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public empresasService: EmpresaService,
    public PedidosService: PedidosService

  ) {
   }

  ngOnInit() {
    this.PedidosService.getOngs().subscribe(res => {
      this.ongs = res
      this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.idPedido = params;
        this.getPedido(this.idPedido.id)
        this.getUsuarios(this.idPedido.id)
        return this.idPedido
      });
    });
    
    
    this.empresasService.getEstados().subscribe(res => {
      this.estados = res;
      
    });
  }
  getPedido(id){
    this.pedido = this.ongs.filter(on=>{
      return on.IdEmpresa== id
    })[0]
  }
  
  getUsuarios(id){
    this.PedidosService.getUsuariosOngs(id).subscribe(res => {
      this.usuarios = res
    })
  }
  conformCnpj(value: string) {
    return conformToMask(value, masks.cnpj, { guide: false }).conformedValue;
  }
  conformCpf(value: string) {
    return conformToMask(value, masks.cpf, { guide: false }).conformedValue;
  }
  getNomeEstado(id){
    return this.estados.filter(estado=>{
      return estado.IdEstado == Number(id)
    })[0].NomeEstado
  }
  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
    
  

}
