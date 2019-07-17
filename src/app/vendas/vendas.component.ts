import { Component, OnInit } from '@angular/core';
import { EmpresaService } from './../providers/empresa.service';
import { PedidosService } from './../providers/pedidos.service';
import { CarrinhoService } from './../providers/carrinho.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  empresas: any;
  vendas: any;
  idEmpresa: any;
  idEmpresaComprador: any;
  nomeEmpresa: any;
  returnVendas: any;
  formas_pagamento: any;
  p: number = 1;
  collection: any[] = [];  
  constructor(
    public empresasService: EmpresaService,
    public vendasService: PedidosService,
    public carrinhoService: CarrinhoService,
    public router: Router,
    public spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.spinner.show()
    this.empresasService.getEmpresas().subscribe(
      res => {
        this.empresas = res
        console.log("EMpresa", this.empresas)
        this.idEmpresa = this.empresas[0].IdEmpresa
        this.vendasService.getVendas(this.idEmpresa).subscribe( res => { 
          var aux:any=[]    
          aux=res          
          this.getEmpresaComprador(res);
          this.collection= aux
          console.log("comprador", res)
          this.spinner.hide()
        }) 
      },
      error=>{
        if(error.status == 401 || error.status == 403 ){
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
      }
    )
    this.carrinhoService.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });
    
  }
  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA:any = new Date(a.DataInclusao);
      var dateB:any = new Date(b.DataInclusao);
      return dateB - dateA;
    });
    this.vendas = arr;
    return this.vendas
  }

  getEmpresaComprador(pedidos){
    pedidos.forEach(pedido => {
      this.empresasService.getEmpresaById(pedido.IdEmpresaComprador).subscribe(
        (response: any)=> {
            pedido.EmpresaComprador = response.NomeEmpresa;
            
        },
        (error)=> {
          
        }
      );
    });
    this.orderByDate(pedidos);
  }

  viewPedido(id) {
    this.router.navigate(['venda-view'], { queryParams: { id: id } })
  }
  getTotal(pedido) {
    let total = 0;
    pedido.Itens.forEach(item => {
      total += item.ValorDesconto * item.Quantidade;
    });
    return total;
  }
  getFormaPagamento(id) {
    let forma_pagamento;
    forma_pagamento = this.formas_pagamento.find(forma => {
      return forma.IdFormaPagamento === id;
    });
    if(forma_pagamento == undefined){
      return "-"
    }else{
      return forma_pagamento.NomeFormaPagamento;
    }
    
  }
}
