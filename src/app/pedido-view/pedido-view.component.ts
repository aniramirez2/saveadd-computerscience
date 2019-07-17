import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, StatusPedido } from './../providers/pedidos.service';
import { CarrinhoService } from './../providers/carrinho.service';
import { EmpresaService } from './../providers/empresa.service';
import { ProductService } from './../providers/product.service';
import { AuthService } from './../providers/auth.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { CodigoBarras } from './../shared/codigo-barras.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
const swal: SweetAlert = _swal as any;


@Component({
  selector: 'app-venda-view',
  templateUrl: './pedido-view.component.html'
})
export class PedidoViewComponent implements OnInit {
  sub: any;
  idPedido: any;
  pedido: any;
  pedidoAtualizar: any;
  formas_pagamento: any;
  empresaCompradora: any;
  Enderecos: any;
  endereco: any;
  Itens: any = [];
  idProduto: any;
  produto: any;
  estados: any;
  produtoById: any;
  statusPedido: any;
  statusPedidos: StatusPedido[] = [];
  statusPedidoSelecionado: any;
  ensayo: number = 1;
  dataPedido: any;
  horaPedido: any;
  observacoescancelamento = ''
  CodigoBarras: any = [
    {
      Codigo: null,
      TipoCodigoBarras: 1
    }
  ]

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public vendaViewService: PedidosService,
    public carrinhoServie: CarrinhoService,
    public empresasService: EmpresaService,
    public produtoService: ProductService,
    private spinner: NgxSpinnerService,
    public auth: AuthService

  ) {
    this.empresaCompradora = {}
    this.Enderecos = []
    this.endereco = {}
    this.Itens = []
  }

  ngOnInit() {
    this.spinner.show();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.idPedido = params;
        return this.idPedido
      });
    this.getPedido(this.idPedido.id)

    this.carrinhoServie.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });

    this.statusPedidos = this.vendaViewService.getStatusPedidos();
    this.empresasService.getEstados().subscribe(res => {
      this.spinner.hide();
      this.estados = res;

    });
  }
  getNameStatus(id) {
    console.log("id", id)
    this.statusPedidos.forEach(element => {
      if (element.Id == id) {
        this.statusPedido = element.Descricao
      }
    });
  }
  atualizarStatusPedido() {
    this.pedidoAtualizar = {
      "IdPedido": this.idPedido.id,
      "StatusPedido": this.statusPedidoSelecionado,
      "Observacoes": this.observacoescancelamento
    }

    this.vendaViewService.update(this.pedidoAtualizar).subscribe(res => {
      swal("Sucesso", "Status Pedido atualizado com Sucesso!", "success");
    }, error => {
      swal("Falha", "Houve uma falha ao atualizar pedido!", "error");
    });
  }

  getPedido(id) {
    this.vendaViewService.getViewPedido(id).subscribe(
      res => {
        this.pedido = res;
        var aux = this.pedido.DataInclusao.split("T")
        this.dataPedido = aux[0]
        var aux2 = aux[1].split(".")
        this.horaPedido = aux2[0]
        this.getNameStatus(this.pedido.StatusPedido)
        this.statusPedidoSelecionado = this.pedido.StatusPedido;
        this.getComprador(this.pedido.IdAnunciante)
        this.getProdutoById();


        return this.pedido
      },
      error => {
        if (error.status == 401) {
          this.auth.logout()
          this.router.navigateByUrl('');
        }
      }

    )
  }

  getFormaPagamento(id) {
    let forma_pagamento;
    forma_pagamento = this.formas_pagamento.find(forma => {
      return forma.IdFormaPagamento === id;
    });
    if (forma_pagamento == undefined) {
      return "-"
    } else {
      return forma_pagamento.NomeFormaPagamento;
    }

  }

  getComprador(id) {
    this.empresasService.getEmpresaById(id).subscribe(
      res => {
        this.empresaCompradora = res
        //console.log("empresa compradora", this.empresaCompradora)
        this.setNomeEstado()
        return this.empresaCompradora
      }
    )
  }

  getTotal(pedido) {
    let total = 0;
    pedido.Itens.forEach(item => {
      total += item.ValorDesconto * item.Quantidade;
    });
    return total;
  }

  getTotalProduto(produto) {
    var total: number = 0
    total = produto.Quantidade * produto.ValorDesconto
    return total
  }

  formatValue(value) {
    var valor: any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }


  getProduto(id) {
    this.produtoService.getById(id).subscribe(
      res => {
        this.produtoById = res;
        //console.log("prod by id", this.produtoById)
      }
    )
  }
  getProdutoById() {
    this.pedido.Itens.forEach((item, index) => {
      this.produtoService.getById(item.IdAnuncioProduto).subscribe(
        res => {
          this.produtoById = res
          this.pedido.Itens[index].infoProduct = {
            "IdProduto": this.produtoById.IdProduto,
            "NomeProduto": this.produtoById.NomeProduto, "CodigoBarras": this.produtoById.CodigoBarras
          }
        }
      )
    });
    //console.log("pedido itens", this.pedido.Itens);
  }
  setNomeEstado() {
    this.empresaCompradora.Enderecos.forEach((endereco, index) => {
      this.estados.forEach(estado => {
        if (endereco.Estado == estado.IdEstado) {
          this.empresaCompradora.Enderecos[index].Estado = estado.NomeEstado;

        }
      });
    });
  }
  cancelarPedido() {
    swal("Tem certeza que quer cancelar este pedido?", {
      dangerMode: true,
      buttons: ["Não", "Sim"]
    }).then((value) => {

      switch (value) {

        case true:
          this.spinner.show();
          this.pedidoAtualizar = {
            "IdPedido": this.idPedido.id,
            "StatusPedido": 5,
            "Observacoes": this.observacoescancelamento
          }
          console.log("pedido atualizar", this.pedidoAtualizar)
          this.vendaViewService.update(this.pedidoAtualizar).subscribe(res => {
            swal("Sucesso", "Você cancelou o pedido!", "success");
            this.ngOnInit()
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
            swal("Falha", "Houve uma falha ao cancelar pedido!", "error");
          });
      }
    })
  }

}
