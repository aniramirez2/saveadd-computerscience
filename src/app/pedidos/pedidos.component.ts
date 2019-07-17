import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../providers/pedidos.service';
import { EmpresaService } from '../providers/empresa.service';
import { CarrinhoService } from './../providers/carrinho.service';
import { StatusCompra } from './../shared/status-pedido.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './../providers/auth.service'
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  public pedidos: any = [];
  formas_pagamento: any;
  url: any;
  p: number = 1;
  collection: any[] = [];
  isloading = false
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: PedidosService,
    public empresaService: EmpresaService,
    public carrinhoServie: CarrinhoService,
    public spinner: NgxSpinnerService,
    public AuthService: AuthService,
  ) { }

  ngOnInit() {
    if (this.AuthService.isAuthenticated()) {
      this.spinner.show()
      this.isloading = true
      this.service.getPedidos().subscribe(res => {
        var aux: any = []
        aux = res
        console.log("pedidos", aux)
        this.collection = aux
        this.pedidos = aux
        this.getEmpresaComprador(res);
      }, err => {
        this.spinner.hide()
        if (err.status == 401 || err.status == 403) {
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
      });
    } else {
      this.AuthService.logout()
      this.router.navigateByUrl('login')

    }
    if (localStorage.getItem('appSaveAdd') == null) {
      this.AuthService.logout()
      this.router.navigateByUrl('login')
    }
    this.carrinhoServie.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });

  }
  viewPedido(id) {
    this.router.navigate(['pedido-view'], { queryParams: { id: id } })
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA: any = new Date(a.DataInclusao);
      var dateB: any = new Date(b.DataInclusao);
      return dateB - dateA;
    });
    this.pedidos = arr;
    //console.log('pedidos',this.pedidos)
  }

  baixarRecibo(id) {
    this.service.getRecibo(id).subscribe(res => {
      var aux: any = res
      const blob = new Blob([aux], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      //console.log(url)
      window.open(url);
    })
  }

  formatValue(value) {
    var valor: any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }

  getFormaPagamento(id) {
    let forma_pagamento;
    forma_pagamento = this.formas_pagamento.find(forma => {
      return forma.IdFormaPagamento === id;
    });
    if (forma_pagamento == undefined) {
      return "-";
    } else {
      return forma_pagamento.NomeFormaPagamento;
    }

  }

  getTotal(pedido) {
    let total = 0;
    pedido.Itens.forEach(item => {
      total += item.ValorDesconto * item.Quantidade;
    });
    return total;
  }
  getEmpresaComprador(pedidos) {
    pedidos.forEach(pedido => {
      this.empresaService.getEmpresaById(pedido.IdAnunciante).subscribe(
        (response: any) => {
          pedido.EmpresaComprador = response.NomeEmpresa;
          this.isloading = false
          this.spinner.hide()
        },
        (error) => {
          this.isloading = false
          console.log("error", error)
          this.spinner.hide()
        }
      );
    });
    this.spinner.hide()
    this.orderByDate(pedidos);
  }
}
